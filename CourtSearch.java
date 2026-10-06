import java.sql.*;
import java.util.Scanner;

public class CourtSearch {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/cebu_pickleball_hub";
        String username = "root";
        String password = "mysql123";

        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter location to search: ");
        String location = scanner.nextLine();

        String sql = "SELECT * FROM courts WHERE location LIKE ?";

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

                System.out.println("Court ID: " +
                    result.getInt("court_id"));

                System.out.println("Court Name: " +
                    result.getString("court_name"));

                System.out.println("Location: " +
                    result.getString("location"));

                System.out.println("Rate: " +
                    result.getDouble("rate"));

                System.out.println("--------------------");
            }

            if (!found) {
                System.out.println("No courts found.");
            }

            connection.close();

        } catch (SQLException e) {
            e.printStackTrace();
        }

        scanner.close();
    }
}