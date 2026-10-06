import java.util.Scanner;

public class PickleballHub {

    static Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {

        System.out.println("====================================");
        System.out.println("       CEBU PICKLEBALL HUB");
        System.out.println("====================================");

        System.out.println("\nAvailable Courts:");
        System.out.println("1. Cebu Pickleball Hub - ₱200/hour");
        System.out.println("2. Mandaue Pickleball Center - ₱250/hour");
        System.out.println("3. Island Pickleball Courts - ₱180/hour");

        System.out.print("\nChoose a court (1-3): ");
        int choice = scanner.nextInt();
        scanner.nextLine();

        String courtName = "";
        int price = 0;

        if (choice == 1) {
            courtName = "Cebu Pickleball Hub";
            price = 200;
        } else if (choice == 2) {
            courtName = "Mandaue Pickleball Center";
            price = 250;
        } else if (choice == 3) {
            courtName = "Island Pickleball Courts";
            price = 180;
        } else {
            System.out.println("Invalid court selection.");
            return;
        }

        System.out.print("Enter your name: ");
        String name = scanner.nextLine();

        System.out.print("Enter booking date: ");
        String date = scanner.nextLine();

        System.out.print("Enter booking time: ");
        String time = scanner.nextLine();

        System.out.print("Number of players: ");
        int players = scanner.nextInt();

        System.out.println("\n====================================");
        System.out.println("          BOOKING CONFIRMED");
        System.out.println("====================================");

        System.out.println("Player: " + name);
        System.out.println("Court: " + courtName);
        System.out.println("Date: " + date);
        System.out.println("Time: " + time);
        System.out.println("Players: " + players);
        System.out.println("Price: ₱" + price + "/hour");

        System.out.println("====================================");
        System.out.println("Thank you for using Cebu Pickleball Hub!");
    }
}