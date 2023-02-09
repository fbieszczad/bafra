import javax.swing.*;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;


public class DatabaseConnection {
    Connection con;

        public void connect() {
        try {
            Class.forName("com.mysql.jdbc.Driver");
            con = DriverManager.getConnection("jdbc:mysql://localhost/bafra", "root", "");
            JOptionPane.showMessageDialog(null, "Połączono z bazą danych BAFRA");


        } catch (ClassNotFoundException ex) {
            ex.printStackTrace();


        } catch (SQLException ex) {
            ex.printStackTrace();
            JOptionPane.showMessageDialog(null, "Wystąpił błąd podczas połączenia z bazą danych.");

        }
    }


}
