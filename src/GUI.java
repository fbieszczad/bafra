import net.proteanit.sql.DbUtils;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.sql.*;

public class GUI {
    private JPanel Main;
    private JButton dodajButton;
    private JTextField txtIDPojazdu;
    private JButton aktualizujButton;
    private JButton usunButton;
    private JButton wyszukajButton;
    private JTextField txtID;
    private JTextField txtCena;
    private JTextField txtRok;
    private JTextField txtModel;
    private JTextField txtMarka;
    private JScrollPane table_1;
    private JTable table1;
    Connection con;
    PreparedStatement pst;

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

    public static void main(String[] args) {

        JFrame frame = new JFrame("Komis samochodowy BAFRA");
        frame.setContentPane(new GUI().Main);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);

    }

    void table_load() {

        try {
            pst = con.prepareStatement("SELECT * FROM Pojazdy");
            ResultSet rs = pst.executeQuery();
            table1.setModel(DbUtils.resultSetToTableModel(rs));

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public GUI() {

        connect();
        table_load();
        dodajButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String id_pojazdu, marka, model, rok_produkcji, cena;
                id_pojazdu = txtIDPojazdu.getText();
                marka = txtMarka.getText();
                model = txtModel.getText();
                rok_produkcji = txtRok.getText();
                cena = txtCena.getText();

                try {
                    pst = con.prepareStatement("INSERT INTO pojazdy(id_pojazdu,marka,model,rok_produkcji,cena) VALUES(?,?,?,?,?)");
                    pst.setString(1, id_pojazdu);
                    pst.setString(2, marka);
                    pst.setString(3, model);
                    pst.setString(4, rok_produkcji);
                    pst.setString(5, cena);
                    pst.executeUpdate();
                    JOptionPane.showMessageDialog(null, "Dodano pojazd do katalogu.");
                    table_load();
                    txtIDPojazdu.setText("");
                    txtMarka.setText("");
                    txtModel.setText("");
                    txtRok.setText("");
                    txtCena.setText("");
                    txtID.requestFocus();

                } catch (SQLException e1) {
                    e1.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Wystąpił błąd. Sprawdź czy pojazd o podanym ID istnieje w systemie.");
                }
            }
        });
        wyszukajButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                try {

                    String insertID = txtID.getText();

                    pst = con.prepareStatement("SELECT id_pojazdu,marka,model,rok_produkcji,cena FROM Pojazdy WHERE id_pojazdu = ?");
                    pst.setString(1, insertID);
                    ResultSet rs = pst.executeQuery();

                    if (rs.next() == true) {
                        String id_pojazdu = rs.getString(1);
                        String marka = rs.getString(2);
                        String model = rs.getString(3);
                        String rok_produkcji = rs.getString(4);
                        String cena = rs.getString(5);

                        txtIDPojazdu.setText(id_pojazdu);
                        txtMarka.setText(marka);
                        txtModel.setText(model);
                        txtRok.setText(rok_produkcji);
                        txtCena.setText(cena);

                    } else {
                        txtIDPojazdu.setText("");
                        txtMarka.setText("");
                        txtModel.setText("");
                        txtRok.setText("");
                        txtCena.setText("");
                        JOptionPane.showMessageDialog(null, "Błąd podczas wyszukiwania pojazdu. W bazie danych nie ma pojazdu o podanym ID.");

                    }
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
        });
        aktualizujButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String id_pojazdu, marka, model, rok_produkcji, cena;
                id_pojazdu = txtIDPojazdu.getText();
                marka = txtMarka.getText();
                model = txtModel.getText();
                rok_produkcji = txtRok.getText();
                cena = txtCena.getText();

                try {
                    pst = con.prepareStatement("UPDATE Pojazdy SET marka = ?,model = ?,rok_produkcji = ?,cena = ? WHERE id_pojazdu = ?");
                    pst.setString(1, marka);
                    pst.setString(2, model);
                    pst.setString(3, rok_produkcji);
                    pst.setString(4, cena);
                    pst.setString(5, id_pojazdu);

                    pst.executeUpdate();
                    JOptionPane.showMessageDialog(null, "Zaktualizowano dane o pojeździe");
                    table_load();
                    txtIDPojazdu.setText("");
                    txtMarka.setText("");
                    txtModel.setText("");
                    txtRok.setText("");
                    txtCena.setText("");
                    txtID.requestFocus();

                } catch (SQLException e1) {
                    e1.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Wystąpił błąd.");
                }
            }
    });
        usunButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                String id_pojazdu;
                id_pojazdu = txtID.getText();

                try {
                    pst = con.prepareStatement("DELETE from Pojazdy WHERE id_pojazdu = ?");

                    pst.setString(1, id_pojazdu);

                    pst.executeUpdate();
                    JOptionPane.showMessageDialog(null, "Usunięto pojazd z katalogu.");
                    table_load();
                    txtMarka.setText("");
                    txtModel.setText("");
                    txtRok.setText("");
                    txtCena.setText("");
                    txtID.requestFocus();
                }

                catch (SQLException e1)
                {

                    e1.printStackTrace();
                    JOptionPane.showMessageDialog(null, "Wystąpił błąd.");
                }
            }
        });
    }
}
