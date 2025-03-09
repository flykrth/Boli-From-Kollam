import 'package:flutter/material.dart';

AppBar appBar() {
  return AppBar(
    title: Text(
      "Mission Mruda",
      style: TextStyle(
        fontFamily: 'Samkaran',
        color: Color.fromRGBO(88, 129, 87, 1),
        fontSize: 32,
        fontWeight: FontWeight.bold,
      ),
    ),
    backgroundColor: Color.fromRGBO(163, 177, 138, 1),
    elevation: 10,
    shadowColor: Color.fromRGBO(88, 129, 87, 1),
  );
}
