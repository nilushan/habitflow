#!/usr/bin/env python3
"""
UI Evaluation Script - Capture screenshots of all HabitFlow pages
"""

from playwright.sync_api import sync_playwright
import os

# Create screenshots directory
os.makedirs('/tmp/habitflow_screenshots', exist_ok=True)

pages_to_test = [
    ('/', 'landing'),
    ('/habits', 'habits'),
    ('/journal', 'journal'),
    ('/insights', 'insights'),
    ('/coach', 'coach'),
]

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    # Use a larger viewport for better screenshots
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    for url_path, page_name in pages_to_test:
        print(f"\n📸 Capturing {page_name} page...")

        try:
            # Navigate to page
            page.goto(f'http://localhost:3004{url_path}')

            # Wait for page to fully load and animations to settle
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(2000)  # Wait for animations

            # Take full page screenshot
            screenshot_path = f'/tmp/habitflow_screenshots/{page_name}.png'
            page.screenshot(path=screenshot_path, full_page=True)

            print(f"✅ Saved screenshot to {screenshot_path}")

            # Get page title for verification
            title = page.title()
            print(f"   Page title: {title}")

        except Exception as e:
            print(f"❌ Error capturing {page_name}: {e}")

    browser.close()

print("\n✨ Screenshot capture complete!")
print("Screenshots saved in: /tmp/habitflow_screenshots/")
