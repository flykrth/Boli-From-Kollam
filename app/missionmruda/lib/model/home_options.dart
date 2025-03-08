class HomeOptions {
  String option;
  String iconPath;

  HomeOptions({
    required this.option,
    required this.iconPath,
  });

  static List<HomeOptions> getOptions() {
    List<HomeOptions> options = [];

    options.add(HomeOptions(
        option: "View your Mruda conditions", iconPath: "assets/soil.png"));

    options.add(HomeOptions(
        option: "Risk of crop failure", iconPath: "assets/doubts.png"));

    options.add(HomeOptions(
        option: "Marketplace suggestions", iconPath: "assets/bulb.png"));

    options.add(
        HomeOptions(option: "About Mission Mruda", iconPath: "assets/MM.png"));

    return options;
  }
}
