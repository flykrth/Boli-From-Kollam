import 'package:flutter/material.dart';
import 'package:missionmruda/model/appbar.dart';
import 'package:missionmruda/model/home_options.dart';
import 'package:missionmruda/view/about.dart';
import 'package:missionmruda/view/login.dart';
import 'package:missionmruda/view/market.dart';
import 'package:missionmruda/view/risk.dart';
import 'package:missionmruda/view/seed.dart';
import 'package:missionmruda/view/soil.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  late List<HomeOptions> options;

  @override
  void initState() {
    super.initState();
    options = HomeOptions.getOptions();
  }

  void navigateToPage(int index) {
    Widget page;
    switch (index) {
      case 0:
        page = SoilPage();
        break;
      case 1:
        page = RiskPage();
        break;
      case 2:
        page = CultivationRankingsScreen();
        break;
      case 3:
        page = SeedMatchScreen();
        break;
      default:
        return;
    }
    Navigator.push(
      context,
      MaterialPageRoute(builder: (context) => page),
    );
  }

  void logout() {
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => LoginPage()),
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: appBar(),
      backgroundColor: Colors.black,
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(height: 36),
          Container(
            alignment: Alignment.center,
            child: Text(
              "What would you like to do today?",
              style: TextStyle(
                  fontSize: 24,
                  color: Color.fromRGBO(163, 177, 138, 1),
                  fontWeight: FontWeight.bold),
            ),
          ),
          SizedBox(height: 50),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 50),
            child: SizedBox(
              height: 460,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Column(
                    children: [
                      homeOptionContainer(0, 140, 240),
                      SizedBox(height: 15),
                      homeOptionContainer(2, 140, 200),
                    ],
                  ),
                  SizedBox(width: 20),
                  Column(
                    children: [
                      homeOptionContainer(1, 140, 200),
                      SizedBox(height: 15),
                      homeOptionContainer(3, 140, 240),
                    ],
                  ),
                ],
              ),
            ),
          ),
          SizedBox(
            height: 15,
          ),
          Padding(
            padding: const EdgeInsets.only(left: 40),
            child: MaterialButton(
              onPressed: logout,
              child: Container(
                height: 50,
                width: 300,
                decoration: BoxDecoration(
                  color: Color.fromRGBO(34, 51, 43, 1),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Center(
                  child: Text(
                    "Logout",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Color.fromRGBO(163, 177, 138, 1),
                        fontSize: 24,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget homeOptionContainer(int index, double width, double height) {
    return GestureDetector(
      onTap: () => navigateToPage(index),
      child: Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: Color.fromRGBO(58, 90, 64, 1),
          borderRadius: BorderRadius.circular(15),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Image.asset(
              options[index].iconPath,
              height: 120,
              width: 240,
            ),
            SizedBox(height: 15),
            Container(
              width: 135,
              child: Text(
                options[index].option,
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
