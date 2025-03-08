import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:missionmruda/model/appbar.dart';

class CultivationRankingsScreen extends StatefulWidget {
  @override
  _CultivationRankingsScreenState createState() =>
      _CultivationRankingsScreenState();
}

class _CultivationRankingsScreenState extends State<CultivationRankingsScreen> {
  List<Map<String, dynamic>> rankedCities = [];

  @override
  void initState() {
    super.initState();
    fetchCultivationRankings();
  }

  Future<void> fetchCultivationRankings() async {
    try {
      final response = await http
          .get(Uri.parse("http://192.168.12.33:5002/cultivation-rankings"));

      if (response.statusCode == 200) {
        Map<String, dynamic> data = json.decode(response.body);
        setState(() {
          rankedCities = List<Map<String, dynamic>>.from(data["rankings"]);
        });
      } else {
        throw Exception("Failed to load cultivation rankings");
      }
    } catch (e) {
      print("Error fetching data: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.black,
      body: Padding(
        padding: const EdgeInsets.all(18),
        child: rankedCities.isEmpty
            ? Center(child: CircularProgressIndicator())
            : ListView.builder(
                itemCount: rankedCities.length,
                itemBuilder: (context, index) {
                  var city = rankedCities[index]["city"];
                  var score = rankedCities[index]["score"];
                  return Card(
                    margin: EdgeInsets.symmetric(vertical: 8, horizontal: 16),
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
                      title: Text(city,
                          style: TextStyle(fontWeight: FontWeight.bold)),
                      trailing: Text(
                        score.toStringAsFixed(2),
                        style: TextStyle(
                            fontSize: 18,
                            color: score > 85
                                ? Colors.green
                                : (score > 65 ? Colors.orange : Colors.red)),
                      ),
                    ),
                  );
                },
              ),
      ),
    );
  }
}
