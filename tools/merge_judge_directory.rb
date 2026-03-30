#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "yaml"
require "time"
require "fileutils"

ROOT = File.expand_path("..", __dir__)
OFFICIAL_PATH = File.join(ROOT, "assets", "data", "official-judges.json")
LIVE_PATH = File.join(ROOT, "_data", "bias-beacon", "live-oregon-data.yml")
OUTPUT_PATH = File.join(ROOT, "_data", "bias-beacon", "judges-directory.json")

def normalize_name_key(value)
  value.to_s
       .gsub(/\bjudge\b/i, " ")
       .gsub(/[^a-zA-Z ]+/, " ")
       .downcase
       .split
       .select { |part| part.length > 1 }
       .yield_self do |parts|
    [parts.first, parts.last].compact.join(" ")
  end
end

def format_term_expires(value)
  return nil if value.nil? || value.to_s.empty?

  Time.parse(value.to_s).utc.strftime("%b %-d, %Y")
rescue ArgumentError
  value.to_s
end

def score_payload(risk_assessment)
  case risk_assessment.to_s.downcase
  when "critical"
    [85, "critical", "Critical"]
  when "high"
    [70, "high", "High Risk"]
  when "moderate"
    [50, "moderate", "Moderate"]
  when "low"
    [30, "low", "Low Risk"]
  else
    [nil, "pending", "Pending"]
  end
end

official = JSON.parse(File.read(OFFICIAL_PATH))
live = YAML.safe_load(File.read(LIVE_PATH), aliases: true)

live_index = {}
live.fetch("oregon_judges", {}).each_value do |judges|
  Array(judges).each do |judge|
    key = [normalize_name_key(judge["name"]), judge["county"].to_s.downcase]
    live_index[key] = judge
  end
end

merged = official.fetch("judges", []).map do |official_judge|
  county = official_judge["county"].to_s
  live_match = live_index[[normalize_name_key(official_judge["name"]), county.downcase]]

  score, level, level_label = score_payload(live_match&.dig("risk_assessment"))
  focus = Array(live_match&.dig("specialization")).join(", ")
  focus = "General judicial profile" if focus.empty?
  flags = Array(live_match&.dig("accountability_flags"))
  court = official_judge["category"].to_s.empty? ? "Judicial Officer" : official_judge["category"]
  role_title = official_judge["roleTitle"].to_s.empty? ? court : official_judge["roleTitle"]
  summary = if county.empty? || county.casecmp("statewide").zero?
    "#{role_title} serving in Oregon's #{court}."
  else
    "#{role_title} serving #{county} County in Oregon's #{court}."
  end

  {
    "id" => "official-#{official_judge['id']}",
    "officialId" => official_judge["id"],
    "name" => official_judge["name"],
    "nameKey" => official_judge["nameKey"] || normalize_name_key(official_judge["name"]),
    "category" => court,
    "roleTitle" => role_title,
    "county" => county.empty? ? "Statewide" : county,
    "district" => official_judge["district"],
    "position" => official_judge["position"],
    "termExpires" => official_judge["termExpires"],
    "termExpiresDisplay" => format_term_expires(official_judge["termExpires"]),
    "email" => official_judge["email"],
    "phone" => official_judge["phone"],
    "bioUrl" => official_judge["bioUrl"],
    "officialPhotoUrl" => official_judge["officialPhotoUrl"],
    "officialPhotoCourt" => official_judge["officialPhotoCourt"],
    "officialPhotoDistrict" => official_judge["officialPhotoDistrict"],
    "officialPhotoCounties" => official_judge["officialPhotoCounties"],
    "isPresiding" => role_title.downcase.include?("presiding"),
    "isProTem" => role_title.downcase.include?("pro tem"),
    "score" => score,
    "scoreLabel" => level_label,
    "riskLevel" => level,
    "metricsVerified" => !live_match.nil?,
    "summary" => summary,
    "focus" => focus,
    "caseload2024" => live_match&.dig("caseload_2024"),
    "tenureDisplay" => if live_match
      start_term = live_match["tenure_start"]
      end_term = live_match["tenure_end"] || "Present"
      "#{start_term} - #{end_term}"
    else
      "Current term expires #{format_term_expires(official_judge['termExpires']) || 'Unknown'}"
    end,
    "prisonUsage" => live_match&.dig("bias_metrics", "prison_rate"),
    "reversalRate" => live_match&.dig("appellate_record", "reversal_rate"),
    "counselDisparity" => live_match&.dig("bias_metrics", "sentence_disparity", "counsel_representation", "disparity_score"),
    "racialDisparity" => live_match&.dig("bias_metrics", "sentence_disparity", "racial", "disparity_score"),
    "appeals2024" => live_match&.dig("appellate_record", "total_appeals_2024"),
    "flags" => flags,
    "sourceNotes" => {
      "officialRoster" => "Oregon Judicial Department",
      "officialPhoto" => official_judge["officialPhotoUrl"] ? "Oregon Blue Book" : nil,
      "analyticMetrics" => live_match ? "Bias Beacon local analytic dataset" : nil
    }
  }
end

payload = {
  "generatedAt" => Time.now.utc.iso8601,
  "sourceNotes" => {
    "officialRoster" => official.dig("sourceNotes", "judges"),
    "circuitPhotos" => official.dig("sourceNotes", "circuitPhotos"),
    "supremePhotos" => official.dig("sourceNotes", "supremePhotos"),
    "appellatePhotos" => official.dig("sourceNotes", "appellatePhotos"),
    "analyticMetrics" => "Merged from _data/bias-beacon/live-oregon-data.yml where a current official judge matched the existing analytic layer."
  },
  "counts" => {
    "officialJudges" => merged.length,
    "presidingJudges" => merged.count { |judge| judge["isPresiding"] },
    "proTemJudges" => merged.count { |judge| judge["isProTem"] },
    "judgesWithMetrics" => merged.count { |judge| judge["metricsVerified"] }
  },
  "judges" => merged
}

FileUtils.mkdir_p(File.dirname(OUTPUT_PATH))
File.write(OUTPUT_PATH, JSON.pretty_generate(payload))

puts "Wrote #{merged.length} judges to #{OUTPUT_PATH}"
