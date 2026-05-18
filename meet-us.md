---
layout: default
title: Meet the Team — A.P.T.I.T.U.D.E.
permalink: /meet-us/
body_class: meet-us-page
---
<style>
.meet-us-page .meet-hero {
  text-align: center;
  padding: 5rem 1.5rem 3rem;
}
.meet-us-page .meet-hero-eyebrow {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(159,168,255,0.85);
  margin: 0 0 0.75rem;
}
.meet-us-page .meet-hero-title {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #e8eeff;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;
}
.meet-us-page .meet-hero-title em {
  font-style: normal;
  color: #9fa8ff;
}
.meet-us-page .meet-hero-deck {
  font-size: 1.05rem;
  color: rgba(200, 218, 255, 0.75);
  max-width: 52ch;
  margin: 0 auto;
  line-height: 1.65;
}

/* Team grid */
.meet-us-page .team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem 5rem;
}

/* Team card */
.meet-us-page .team-card {
  background:
    linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.015)),
    linear-gradient(145deg, rgba(18,25,42,0.96), rgba(7,10,18,0.99));
  border: 1px solid rgba(100,130,220,0.14);
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 20px 50px rgba(0,0,0,0.45),
    0 0 0 1px rgba(80,100,200,0.06),
    inset 0 1px 0 rgba(255,255,255,0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.meet-us-page .team-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 28px 60px rgba(0,0,0,0.55),
    0 0 30px rgba(80,120,220,0.15),
    inset 0 1px 0 rgba(255,255,255,0.1);
}
.meet-us-page .team-photo-wrap {
  width: 100%;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: linear-gradient(135deg, #151890, #2540c8, #3070d8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.meet-us-page .team-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
}
.meet-us-page .team-photo-placeholder {
  font-size: 3.5rem;
  color: rgba(180,210,255,0.4);
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-weight: 800;
  letter-spacing: 0.05em;
}
.meet-us-page .team-info {
  padding: 1.5rem 1.5rem 1.75rem;
}
.meet-us-page .team-name {
  font-family: "Space Grotesk", system-ui, sans-serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e8eeff;
  margin: 0 0 0.25rem;
}
.meet-us-page .team-role {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(159,168,255,0.85);
  margin: 0 0 0.85rem;
}
.meet-us-page .team-bio {
  font-size: 0.9rem;
  color: rgba(200,218,255,0.7);
  line-height: 1.6;
  margin: 0;
}

/* Upload notice bar */
.meet-us-page .upload-notice {
  text-align: center;
  padding: 1.25rem 1.5rem;
  margin: 0 auto 2rem;
  max-width: 700px;
  background: rgba(100,120,220,0.1);
  border: 1px dashed rgba(100,140,255,0.25);
  border-radius: 10px;
  font-size: 0.85rem;
  color: rgba(180,210,255,0.65);
}
</style>

<div class="meet-hero" data-reveal>
  <p class="meet-hero-eyebrow">The People Behind the Platform</p>
  <h1 class="meet-hero-title">Built by people who believe <em>accountability</em> starts with data.</h1>
  <p class="meet-hero-deck">A.P.T.I.T.U.D.E. was built by researchers, technologists, and advocates committed to making Oregon's justice system legible to everyone.</p>
</div>

<p class="upload-notice">Team photos will appear here. Drop photo files into <code>assets/images/team/</code> and update the <code>src</code> on each card.</p>

<div class="team-grid" data-reveal>

  <div class="team-card">
    <div class="team-photo-wrap">
      <span class="team-photo-placeholder">?</span>
    </div>
    <div class="team-info">
      <h2 class="team-name">Your Name</h2>
      <p class="team-role">Founder &amp; Director</p>
      <p class="team-bio">Add your bio here. Tell visitors what drives you, your background, and why you built this platform.</p>
    </div>
  </div>

  <div class="team-card">
    <div class="team-photo-wrap">
      <span class="team-photo-placeholder">?</span>
    </div>
    <div class="team-info">
      <h2 class="team-name">Team Member</h2>
      <p class="team-role">Role &amp; Specialty</p>
      <p class="team-bio">Brief bio about this team member's background and contribution to the platform.</p>
    </div>
  </div>

  <div class="team-card">
    <div class="team-photo-wrap">
      <span class="team-photo-placeholder">?</span>
    </div>
    <div class="team-info">
      <h2 class="team-name">Team Member</h2>
      <p class="team-role">Role &amp; Specialty</p>
      <p class="team-bio">Brief bio about this team member's background and contribution to the platform.</p>
    </div>
  </div>

</div>
