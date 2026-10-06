import java.sql.*;
import java.util.Scanner;

public class CebuPickleballHub {

    static String url = "jdbc:mysql://localhost:3306/cebu_pickleball_hub";
    static String username = "root";
    static String password = "mysql123";

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);

        while (true) {

            System.out.println("\n===== CEBU PICKLEBALL HUB =====");
            System.out.println("1. View All Courts");
            System.out.println("2. Search by Location");
            System.out.println("3. Search by Court Name");
            System.out.println("4. Exit");
            System.out.print("Enter your choice: ");

            int choice = scanner.nextInt();
            scanner.nextLine();

            if (choice == 1) {
                viewAllCourts();

            } else if (choice == 2) {
                System.out.print("Enter location: ");
                String location = scanner.nextLine();
                searchByLocation(location);

            } else if (choice == 3) {
                System.out.print("Enter court name: ");
                String name = scanner.nextLine();
                searchByName(name);

            } else if (choice == 4) {
                System.out.println("Thank you for using Cebu Pickleball Hub!");
                break;

            } else {
                System.out.println("Invalid choice.");
            }
        }

        scanner.close();
    }

    // View all courts
    static void viewAllCourts() {

        String sql = "SELECT * FROM courts";

        try {
            Connection connection =
                DriverManager.getConnection(url, username, password);

            Statement statement = connection.createStatement();

            ResultSet result = statement.executeQuery(sql);

            while (result.next()) {
                displayCourt(result);
            }

            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Search by location
    static void searchByLocation(String location) {

        String sql =
            "SELECT * FROM courts WHERE location LIKE ?";

        try {
            Connection connection =
                DriverManager.getConnection(url, username, password);

            PreparedStatement statement =
                connection.prepareStatement(sql);

            statement.setString(1, "%" + location + "%");

            ResultSet result = statement.executeQuery();

            boolean found = false;

            while (result.next()) {
                found = true;
                displayCourt(result);
            }

            if (!found) {
                System.out.println("No courts found.");
            }

            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Search by court name
    static void searchByName(String name) {

        String sql =
            "SELECT * FROM courts WHERE court_name LIKE ?";

        try {
            Connection connection =
                DriverManager.getConnection(url, username, password);

            PreparedStatement statement =
                connection.prepareStatement(sql);

            statement.setString(1, "%" + name + "%");

            ResultSet result = statement.executeQuery();

            boolean found = false;

            while (result.next()) {
                found = true;
                displayCourt(result);
            }

            if (!found) {
                System.out.println("No courts found.");
            }

            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // Display court information
    static void displayCourt(ResultSet result) throws SQLException {

        System.out.println("\n-----------------------------");
        System.out.println("Court ID: " +
            result.getInt("court_id"));

        System.out.println("Court Name: " +
            result.getString("court_name"));

        System.out.println("Location: " +
            result.getString("location"));

        System.out.println("Rate: ₱" +
            result.getDouble("rate"));

        System.out.println("Schedule: " +
            result.getString("schedule"));

        System.out.println("Facilities: " +
            result.getString("facilities"));

        System.out.println("Contact: " +
            result.getString("contact"));

        System.out.println("Booking Details: " +
            result.getString("booking_details"));

        System.out.println("-----------------------------");
    }
}