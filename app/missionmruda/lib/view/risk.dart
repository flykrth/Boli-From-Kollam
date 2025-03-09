import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

import 'package:missionmruda/model/appbar.dart';

class RiskPage extends StatefulWidget {
  @override
  _RiskPageState createState() => _RiskPageState();
}

class _RiskPageState extends State<RiskPage> {
  bool isLoading = true;
  bool hasError = false;
  Map<String, dynamic>? data;

  @override
  void initState() {
    super.initState();
    fetchRiskData();
  }

  Future<void> fetchRiskData() async {
    try {
      final response =
          await http.get(Uri.parse("http://192.168.7.33:5001/predict"));

      if (response.statusCode == 200) {
        setState(() {
          data = json.decode(response.body);
          isLoading = false;
        });
      } else {
        throw Exception("Failed to load data");
      }
    } catch (e) {
      setState(() {
        hasError = true;
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.black,
      body: Center(
        child: isLoading
            ? CircularProgressIndicator(
                color: Color.fromRGBO(58, 90, 64, 1),
              )
            : hasError
                ? Text("Error fetching data. Please try again.",
                    style: TextStyle(color: Colors.red, fontSize: 16))
                : Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        InfoCard(
                            title: "Temperature",
                            value: "${data!['temperature']}°C"),
                        InfoCard(
                            title: "Humidity", value: "${data!['humidity']}%"),
                        InfoCard(
                            title: "Soil Moisture",
                            value: "${data!['moisture']}%"),
                        InfoCard(
                            title: "Rainfall",
                            value: "${data!['rainfall']} mm"),
                        SizedBox(height: 20),
                        Text(
                          "Prediction:",
                          style: TextStyle(
                              color: Color.fromRGBO(58, 90, 64, 1),
                              fontSize: 18,
                              fontWeight: FontWeight.bold),
                        ),
                        Text(
                          data!['prediction'],
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: data!['prediction'].contains("High Risk")
                                ? Colors.red
                                : Colors.green,
                          ),
                        ),
                      ],
                    ),
                  ),
      ),
    );
  }
}

class InfoCard extends StatelessWidget {
  final String title;
  final String value;

  const InfoCard({required this.title, required this.value});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: EdgeInsets.symmetric(vertical: 8),
      child: ListTile(
        shape: RoundedRectangleBorder(
          borderRadius:
              BorderRadius.circular(15), // Adjust the radius for roundness
        ),
        tileColor: Color.fromRGBO(58, 90, 64, 1),
        title: Text(title,
            style: TextStyle(
                color: Color.fromRGBO(163, 177, 138, 1),
                fontWeight: FontWeight.bold)),
        trailing: Text(value,
            style: TextStyle(
                fontSize: 18, color: Color.fromRGBO(163, 177, 138, 1))),
      ),
    );
  }
}
