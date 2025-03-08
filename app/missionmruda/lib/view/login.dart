import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:http/http.dart' as http;
import 'package:missionmruda/view/home.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool isLoading = false;

  Future<void> _login() async {
    String username = _usernameController.text.trim();
    String password = _passwordController.text.trim();

    if (username.isEmpty || password.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Username and password cannot be empty')),
      );
      return;
    }

    final url = Uri.parse('http://192.168.12.33:5000/login');
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"username": username, "password": password}),
    );

    if (response.statusCode == 200) {
      Navigator.pushReplacement(
        context,
        MaterialPageRoute(builder: (context) => HomePage()),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Invalid username or password')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.black,
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 30),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              "Mission Mruda",
              style: TextStyle(
                  fontFamily: 'Samkaran',
                  color: const Color.fromRGBO(58, 90, 64, 1),
                  fontSize: 50,
                  fontWeight: FontWeight.bold),
            ),
            Text(
              "AI-driven IoT soil monitoring for smarter farming.",
              style: TextStyle(
                  color: Color.fromRGBO(163, 177, 138, 1),
                  fontSize: 24,
                  fontWeight: FontWeight.w400),
            ),
            SizedBox(
              height: 40,
            ),
            Text(
              "Enter to login:",
              textAlign: TextAlign.left,
              style: TextStyle(color: Color.fromRGBO(163, 177, 138, 1)),
            ),
            SizedBox(
              height: 15,
            ),
            Form(
                child: Column(
              children: [
                TextFormField(
                  controller: _usernameController,
                  style: TextStyle(color: Color.fromRGBO(163, 177, 138, 1)),
                  keyboardType: TextInputType.name,
                  cursorColor: Color.fromRGBO(58, 90, 64, 1),
                  decoration: InputDecoration(
                    labelText: "Username",
                    labelStyle: TextStyle(
                        fontFamily: 'Samkaran',
                        fontSize: 24,
                        color: const Color.fromRGBO(58, 90, 64, 1)),
                    hintText: "Enter your username",
                    hintStyle:
                        TextStyle(color: Color.fromRGBO(163, 177, 138, 1)),
                    prefixIcon: Icon(
                      CupertinoIcons.person,
                      color: Color.fromRGBO(163, 177, 138, 1),
                    ),
                    focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide:
                            BorderSide(color: Color.fromRGBO(58, 90, 64, 1))),
                    enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(
                          color: Color.fromRGBO(58, 90, 64, 1), width: 2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onChanged: (String value) {},
                  validator: (value) {
                    return value!.isEmpty ? "Enter a valid username" : null;
                  },
                ),
                SizedBox(
                  height: 20,
                ),
                TextFormField(
                  controller: _passwordController,
                  obscureText: true,
                  style: TextStyle(color: Color.fromRGBO(163, 177, 138, 1)),
                  keyboardType: TextInputType.visiblePassword,
                  cursorColor: Color.fromRGBO(58, 90, 64, 1),
                  decoration: InputDecoration(
                    labelText: "Password",
                    labelStyle: TextStyle(
                        fontFamily: 'Samkaran',
                        fontSize: 24,
                        color: Color.fromRGBO(58, 90, 64, 1)),
                    hintText: "Enter your password",
                    hintStyle:
                        TextStyle(color: Color.fromRGBO(163, 177, 138, 1)),
                    prefixIcon: Icon(
                      CupertinoIcons.padlock,
                      color: Color.fromRGBO(163, 177, 138, 1),
                    ),
                    focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                        borderSide:
                            BorderSide(color: Color.fromRGBO(58, 90, 64, 1))),
                    enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(
                          color: Color.fromRGBO(58, 90, 64, 1), width: 2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  onChanged: (String value) {},
                  validator: (value) {
                    return value!.isEmpty ? "Enter a valid password" : null;
                  },
                ),
                SizedBox(
                  height: 20,
                ),
                MaterialButton(
                  height: 50,
                  minWidth: 500,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                  onPressed: isLoading ? null : _login,
                  color: Color.fromRGBO(58, 90, 64, 1),
                  child: isLoading
                      ? CircularProgressIndicator(color: Colors.black)
                      : Text("Login"),
                ),
              ],
            )),
          ],
        ),
      ),
    );
  }
}
