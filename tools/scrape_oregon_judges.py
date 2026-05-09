#!/usr/bin/env python3
"""
Oregon Circuit Court Judges Scraper
Fetches judge data from Oregon's Blue Book, Ballotpedia, and other sources
Includes photos, biographical data, and judicial statistics
"""

import json
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time
from datetime import datetime

class OregonJudgeScraper:
    def __init__(self):
        self.base_url = "https://sos.oregon.gov/blue-book/Pages/state/judicial/circuit-images.aspx"
        self.judges = []
        self.courts = {}
        self.counties = self._get_oregon_counties()
        
    def _get_oregon_counties(self):
        """Get list of all 36 Oregon counties"""
        return [
            "Baker", "Benton", "Clackamas", "Clatsop", "Columbia", "Coos", "Crook",
            "Curry", "Deschutes", "Douglas", "Gilliam", "Grant", "Harney", "Hood River",
            "Jackson", "Jefferson", "Josephine", "Klamath", "Lake", "Lane", "Lincoln",
            "Linn", "Malheur", "Marion", "Morrow", "Multnomah", "Polk", "Sherman",
            "Tillamook", "Umatilla", "Union", "Wallowa", "Wasco", "Washington", "Wheeler",
            "Yamhill"
        ]