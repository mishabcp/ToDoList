import java.io.IOException;
import java.net.InetSocketAddress;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

public class JavaServer {
    public static void main(String[] args) throws Exception {
        // Create HTTP server listening on port 8080
       // Create HTTP server listening on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        
        // Define a handler to handle incoming HTTP requests
        server.createContext("/api/new", new NewHandler());
        
        // Start the server
        server.start();

        // Log a message to indicate that the server is running
        System.out.println("Java server is running on port 8080...");
    }

    static class NewHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            // Handle HTTP requests here
            // ...
            System.out.println("executed");
        }
    }
}
