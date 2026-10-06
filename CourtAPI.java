import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

public class CourtAPI {

    public static void main(String[] args) throws Exception {

        HttpServer server = HttpServer.create(
            new InetSocketAddress(8080), 0
        );

        server.createContext("/api/courts", CourtAPI::getCourts);

        server.setExecutor(null);
        server.start();

        System.out.println("Court API is running!");
        System.out.println("Open: http://localhost:8080/api/courts");
    }

    private static void getCourts(HttpExchange exchange) throws IOException {

        String url = "jdbc:mysql://localhost:3306/cebu_pickleball_hub";
        String username = "root";
        String password = "mysql123";

        StringBuilder json = new StringBuilder();
        json.append("[");

        try {

            Connection connection = DriverManager.getConnection(
                url,
                username,
                password
            );

            String sql = "SELECT * FROM courts";

            Statement statement = connection.createStatement();

            ResultSet result = statement.executeQuery(sql);

            boolean first = true;

            while (result.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{");

                json.append("\"court_id\":")
                    .append(result.getInt("court_id"))
                    .append(",");

                json.append("\"court_name\":\"")
                    .append(result.getString("court_name"))
                    .append("\",");

                json.append("\"location\":\"")
                    .append(result.getString("location"))
                    .append("\",");

                json.append("\"rate\":")
                    .append(result.getDouble("rate"))
                    .append(",");

                json.append("\"schedule\":\"")
                    .append(result.getString("schedule"))
                    .append("\",");

                json.append("\"facilities\":\"")
                    .append(result.getString("facilities"))
                    .append("\",");

                json.append("\"contact\":\"")
                    .append(result.getString("contact"))
                    .append("\",");

                json.append("\"booking_details\":\"")
                    .append(result.getString("booking_details"))
                    .append("\"");

                json.append("}");

                first = false;
            }

            result.close();
            statement.close();
            connection.close();

        } catch (Exception e) {

            e.printStackTrace();

            json = new StringBuilder();
            json.append("{\"error\":\"Database connection failed\"}");
        }

        json.append("]");

        String response = json.toString();

        exchange.getResponseHeaders().add(
            "Content-Type",
            "application/json"
        );

        exchange.getResponseHeaders().add(
            "Access-Control-Allow-Origin",
            "*"
        );

        exchange.sendResponseHeaders(
            200,
            response.getBytes().length
        );

        OutputStream output = exchange.getResponseBody();

        output.write(response.getBytes());

        output.close();
    }
}