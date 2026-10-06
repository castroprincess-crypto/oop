import java.sql.Connection;
import java.sql.DriverManager;

public class DatabaseConnection {

    public static void main(String[] args) {

        String url = "jdbc:mysql://localhost:3306/cebu_pickleball_hub";
        String username = "root";
        String password = "mysql123";

        try {
            Connection connection = DriverManager.getConnection(
                url, username, password
            );

            System.out.println("Database connected successfully!");

            connection.close();

        } catch (Exception e) {

            System.out.println("Connection failed!");
            e.printStackTrace();
        }
    }
}