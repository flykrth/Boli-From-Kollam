import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:missionmruda/model/appbar.dart';

class SeedMatchScreen extends StatefulWidget {
  @override
  _SeedMatchScreenState createState() => _SeedMatchScreenState();
}

class _SeedMatchScreenState extends State<SeedMatchScreen> {
  String? _selectedCity;
  List<Map<String, dynamic>> _recommendedCrops = [];
  String? _soilType, _climateType;

  final List<String> cities = [
    "Thiruvananthapuram",
    "Kochi",
    "Kozhikode",
    "Thrissur",
    "Palakkad",
    "Alappuzha",
    "Wayanad",
    "Idukki"
  ];

  Future<void> fetchRecommendedCrops() async {
    if (_selectedCity == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Please select a city first!")),
      );
      return;
    }

    final response = await http.post(
      Uri.parse("http://192.168.12.33:5003/match-crops"),
      headers: {"Content-Type": "application/json"},
      body: json.encode({"city": _selectedCity}),
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      setState(() {
        _soilType = data["soil"];
        _climateType = data["climate"];
        _recommendedCrops =
            List<Map<String, dynamic>>.from(data["matched_crops"]);
      });
    } else {
      setState(() {
        _recommendedCrops = [];
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Color.fromRGBO(163, 177, 138, 1),
      body: Padding(
        padding: EdgeInsets.all(30),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("🌍 Select City",
                style: TextStyle(
                    color: Color.fromRGBO(88, 129, 87, 1),
                    fontSize: 24,
                    fontWeight: FontWeight.bold)),
            SizedBox(height: 10),
            DropdownButton<String>(
              value: _selectedCity,
              hint: Text(
                style: TextStyle(
                  color: Colors.black,
                ),
                "Choose a city",
              ),
              isExpanded: true,
              items: cities.map((city) {
                return DropdownMenuItem<String>(
                  value: city,
                  child: Text(city),
                );
              }).toList(),
              onChanged: (value) {
                setState(() {
                  _selectedCity = value;
                });
              },
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: fetchRecommendedCrops,
              child: Text(
                "Find Best Crops",
                style: TextStyle(color: Color.fromRGBO(88, 129, 87, 1)),
              ),
            ),
            SizedBox(height: 50),
            _soilType != null && _climateType != null
                ? Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("🌱 Soil Type: $_soilType"),
                      Text("☀ Climate: $_climateType"),
                      SizedBox(height: 10),
                    ],
                  )
                : Container(),
            _recommendedCrops.isNotEmpty
                ? Expanded(
                    child: ListView.builder(
                      itemCount: _recommendedCrops.length,
                      itemBuilder: (context, index) {
                        var crop = _recommendedCrops[index];
                        return Card(
                          margin: EdgeInsets.symmetric(vertical: 8),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                          elevation: 3,
                          child: ListTile(
                            leading: CircleAvatar(
                              backgroundColor: Colors.green,
                              child: Text("${index + 1}",
                                  style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white)),
                            ),
                            title: Text(crop["name"],
                                style: TextStyle(fontWeight: FontWeight.bold)),
                          ),
                        );
                      },
                    ),
                  )
                : Center(
                    child: Text("No results yet. Select a city & search!")),
          ],
        ),
      ),
    );
  }
}
