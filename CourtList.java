import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CourtList {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/cebu_pickleball_hub";
        String username = "root";
        String password = "mysql123";

        try {
            Connection connection = DriverManager.getConnection(
                url, username, password
            );

            System.out.println("Connected to database!");

            String sql = "SELECT * FROM courts";

            Statement statement = connection.createStatement();
            ResultSet result = statement.executeQuery(sql);

            while (result.next()) {

                System.out.println("Court ID: " + result.getInt("court_id"));
                System.out.println("Court Name: " + result.getString("court_name"));
                System.out.println("Location: " + result.getString("location"));
                System.out.println("Rate: " + result.getDouble("rate"));
                System.out.println("Schedule: " + result.getString("schedule"));
                System.out.println("Facilities: " + result.getString("facilities"));
                System.out.println("Contact: " + result.getString("contact"));
                System.out.println("Booking: " + result.getString("booking_details"));
                System.out.println("-----------------------------");
            }

            result.close();
            statement.close();
            connection.close();

        } catch (Exception e) {
            System.out.println("Database error:");
            e.printStackTrace();
        }
    }
}