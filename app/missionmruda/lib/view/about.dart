import 'package:flutter/material.dart';
import 'package:missionmruda/model/appbar.dart';

class AboutScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Color.fromRGBO(163, 177, 138, 1),
      body: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // App Logo
            Center(
              child: Icon(Icons.agriculture, size: 80, color: Colors.green),
            ),
            SizedBox(height: 20),

            // App Title
            Center(
              child: Text(
                "Smart Agriculture Insights",
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
            ),
            SizedBox(height: 10),

            // Description
            Text(
              "This app provides real-time data on soil conditions, crop suitability, "
              "market trends, and cultivation rankings. Our goal is to help farmers "
              "make informed agricultural decisions using AI-powered analytics.",
              style: TextStyle(fontSize: 16),
              textAlign: TextAlign.justify,
            ),
            SizedBox(height: 20),

            // Features Section
            Text("🌿 Key Features:",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            featureItem("Real-time soil analysis"),
            featureItem("AI-based crop suitability prediction"),
            featureItem("Market insights & best-selling locations"),
            featureItem("Cultivation ranking system"),

            SizedBox(height: 20),

            // Contact Information
            Text("📞 Contact Us:",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            contactItem(Icons.computer, "github.com/flykrth/Boli-From-Kollam"),
            contactItem(Icons.house, "Amritapuri"),
            contactItem(Icons.phone, "+91 98989 89898"),
          ],
        ),
      ),
    );
  }

  // Feature Item Widget
  Widget featureItem(String feature) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        children: [
          Icon(Icons.check_circle, color: Colors.green),
          SizedBox(width: 10),
          Expanded(child: Text(feature, style: TextStyle(fontSize: 16))),
        ],
      ),
    );
  }

  // Contact Item Widget
  Widget contactItem(IconData icon, String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        children: [
          Icon(icon, color: Colors.blue),
          SizedBox(width: 10),
          Text(text, style: TextStyle(fontSize: 16)),
        ],
      ),
    );
  }
}
