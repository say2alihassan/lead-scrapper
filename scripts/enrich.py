import sys
import json
import os

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No URL provided"}))
        sys.exit(1)

    url = sys.argv[1]
    api_key = os.environ.get("OPENAI_API_KEY", "")

    if not api_key:
        print(json.dumps({"error": "OPENAI_API_KEY not set"}))
        sys.exit(1)

    try:
        from scrapegraphai.graphs import SmartScraperGraph

        graph_config = {
            "llm": {
                "api_key": api_key,
                "model": "openai/gpt-4o-mini",
            },
            "verbose": False,
            "headless": True,
        }

        scraper = SmartScraperGraph(
            prompt="""Extract the following from this business website:
- owner_name: the business owner or main contact person's name (null if not found)
- email: any contact email address (null if not found)
- phone: any phone number not already known (null if not found)
- instagram: Instagram profile URL or handle (null if not found)
- facebook: Facebook page URL (null if not found)
- twitter: Twitter/X profile URL (null if not found)
- linkedin: LinkedIn page URL (null if not found)
- has_booking: true if they have an online booking system, false otherwise
- description: one sentence describing what this business does

Return ONLY valid JSON with these exact keys.""",
            source=url,
            config=graph_config,
        )

        result = scraper.run()

        # Ensure it's a dict
        if isinstance(result, str):
            result = json.loads(result)

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
