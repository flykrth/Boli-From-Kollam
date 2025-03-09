import 'package:flutter/material.dart';
import 'package:missionmruda/model/appbar.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;

class SoilPage extends StatefulWidget {
  const SoilPage({super.key});

  @override
  State<SoilPage> createState() => _SoilPageState();
}

class _SoilPageState extends State<SoilPage> {
  double dhtTemperature = 0.0;
  double humidity = 0.0;
  double ds18b20Temperature = 0.0;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchSensorData();
  }

  Future<void> fetchSensorData() async {
    final String apiUrl = "http://192.168.7.33:5004/data"; // Flask API

    try {
      final response = await http.get(Uri.parse(apiUrl));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        setState(() {
          humidity = data['humidity'];
          dhtTemperature = data['temperature'];
          isLoading = false;
        });
      } else {
        print("Error: ${response.statusCode}");
      }
    } catch (e) {
      print("API Fetch Error: $e");
    }
  }

  Widget buildSensorContainer(
      String title, String value, IconData icon, Color color) {
    return Container(
      padding: EdgeInsets.all(16),
      margin: EdgeInsets.symmetric(vertical: 10),
      decoration: BoxDecoration(
        color: color.withOpacity(0.9),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 8,
            spreadRadius: 2,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, size: 40, color: Colors.white),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                  color: Colors.white.withOpacity(0.9),
                ),
              ),
              SizedBox(height: 5),
              Text(
                value,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Color.fromRGBO(58, 90, 64, 1),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(15),
            child: Text(
              "Your Mruda conditions",
              style: TextStyle(
                  color: Color.fromRGBO(163, 177, 138, 1),
                  fontSize: 46,
                  fontWeight: FontWeight.bold,
                  shadows: <Shadow>[
                    Shadow(
                      offset: Offset(0, 2),
                      blurRadius: 4,
                      color: Colors.black,
                    ),
                  ]),
            ),
          ),
          SizedBox(height: 10),
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.black,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(20),
                  topRight: Radius.circular(20),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(15),
                child: Column(
                  children: [
                    Text(
                      "Live Sensor Data",
                      style: TextStyle(fontSize: 18, color: Colors.white),
                    ),
                    SizedBox(height: 10),
                    isLoading
                        ? Center(child: CircularProgressIndicator())
                        : Expanded(
                            child: RefreshIndicator(
                              onRefresh: fetchSensorData,
                              child: ListView(
                                physics: AlwaysScrollableScrollPhysics(),
                                children: [
                                  buildSensorContainer(
                                      "Temperature",
                                      "${dhtTemperature.toStringAsFixed(1)}°C",
                                      Icons.thermostat,
                                      Colors.orange),
                                  buildSensorContainer(
                                      "Humidity",
                                      "${humidity.toStringAsFixed(1)}%",
                                      Icons.water_drop,
                                      Colors.blue),
                                ],
                              ),
                            ),
                          ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class conditionBox extends StatelessWidget {
  const conditionBox({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Container(
          width: 150,
          height: 150,
          decoration: BoxDecoration(
              color: Color.fromRGBO(52, 78, 65, 1),
              borderRadius: BorderRadius.circular(15)))
    ]);
  }
}
