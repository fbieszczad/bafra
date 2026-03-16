# CLAUDE.md — AI Assistant Guide for BAFRA

## Project Overview

**BAFRA** (Komis samochodowy BAFRA) is a Java Swing GUI application for managing a car dealership's vehicle inventory. It is a student project (course: Object-Oriented Programming at WSIiZ) with a MySQL backend.

- **Language:** Java 19
- **UI Framework:** Java Swing
- **Database:** MySQL (via JDBC)
- **Build/IDE:** IntelliJ IDEA (no Maven/Gradle — IDE-native compilation)
- **Test Framework:** JUnit 5.8.1

---

## Repository Structure

```
bafra/
├── src/
│   └── DatabaseConnection.java   # Database connectivity layer
├── test/
│   └── GUITest.java              # JUnit 5 test stubs
├── lib/                          # JUnit 5 JAR dependencies
├── .idea/                        # IntelliJ IDEA project config
├── w66874-w48551.iml             # IntelliJ module file (Java 19, src/test folders)
└── .gitignore
```

> **Note:** `GUI.java` (the main Swing window with CRUD operations) was deleted in the latest refactoring commit. The project is currently mid-refactoring: the database layer has been extracted but the GUI class has not yet been re-added.

---

## External Dependencies

Dependencies are provided as local JAR files (not a package manager):

| Dependency | Path | Purpose |
|---|---|---|
| MySQL Connector/J 8.0.13 | `../jar_files/mysql-connector-java-8.0.13.jar` | Database JDBC driver |
| rs2xml | `../rs2xml.jar` | Convert `ResultSet` to `TableModel` for `JTable` |
| JUnit 5.8.1 | `./lib/junit-*.jar` | Unit testing |

These JARs are referenced in `w66874-w48551.iml` and must exist outside the repo (in `../jar_files/` and `../`).

---

## Architecture

The application follows a simple two-layer design:

- **`DatabaseConnection`** (`src/`) — Data layer. Manages the MySQL JDBC connection to `jdbc:mysql://localhost/bafra`. Exposes a `connect()` method that returns a `Connection` and shows JOptionPane dialogs (in Polish) on success/failure.
- **GUI class** (to be restored in `src/`) — Presentation layer. A `JFrame`-based Swing window with a `JTable` for vehicle listing and buttons for CRUD operations: Add (`dodaj`), Update (`aktualizuj`), Delete (`usuń`), Search (`wyszukaj`). Fields: ID, Price (`cena`), Year (`rok`), Model (`model`), Brand (`marka`).

---

## Database Configuration

The database connection is **hardcoded** in `DatabaseConnection.java`:

```java
DriverManager.getConnection("jdbc:mysql://localhost/bafra", "root", "")
```

- Host: `localhost`
- Database: `bafra`
- User: `root`
- Password: *(empty)*

Before running the application, ensure a MySQL instance is running locally with a database named `bafra`.

> **Known issue:** The driver class `com.mysql.jdbc.Driver` is deprecated in MySQL Connector 8.x. The correct class is `com.mysql.cj.jdbc.Driver`. This should be updated.

---

## Development Workflow

### Building

This project uses IntelliJ IDEA's native build system:

1. Open the project in IntelliJ IDEA.
2. Ensure the SDK is set to **Java 19** (configured in `.idea/misc.xml`).
3. Build via **Build → Build Project** or `Ctrl+F9`.
4. Output goes to `/out/`.

There is no `javac` CLI build script or Makefile. If building outside the IDE, you would need to manually compile with:

```sh
javac -cp ".:../jar_files/mysql-connector-java-8.0.13.jar:../rs2xml.jar" src/*.java -d out/
```

### Running Tests

Tests use JUnit 5 and are located in `test/`. Run via IntelliJ's test runner or:

```sh
# Compile tests
javac -cp ".:lib/*:out/" test/GUITest.java -d out/

# Run tests
java -cp ".:lib/*:out/" org.junit.platform.console.standalone.ConsoleLauncher --scan-classpath
```

> **Note:** Current test implementations are empty stubs. When adding tests, follow JUnit 5 conventions (`@Test`, `@BeforeEach`, etc.).

### No CI/CD

There is no CI/CD pipeline configured. All building and testing is done locally via IntelliJ IDEA.

---

## Coding Conventions

- **Language:** Polish is used for UI labels, dialog messages, and variable names related to domain entities (e.g., `marka` = brand, `model`, `rok` = year, `cena` = price). Code structure (class names, method names) uses English.
- **UI dialogs:** Use `JOptionPane` for user-facing messages and confirmations.
- **Database access:** Use JDBC directly (no ORM). Always close `Connection`, `Statement`, and `ResultSet` in `finally` blocks or try-with-resources.
- **Table display:** Use `rs2xml` (`DbUtils.resultSetToTableModel()`) to populate `JTable` from a `ResultSet`.
- **Java version:** Target Java 19 features are allowed.

---

## Known Issues & Technical Debt

1. **Hardcoded credentials** — `DatabaseConnection.java` has `root`/empty password hardcoded. Should be moved to a config file or environment variable.
2. **Deprecated JDBC driver class** — `com.mysql.jdbc.Driver` should be replaced with `com.mysql.cj.jdbc.Driver`.
3. **Empty tests** — `GUITest.java` has `@Test` stubs with no assertions. Tests need real implementations.
4. **Missing GUI class** — `GUI.java` was deleted during refactoring. The Swing frontend needs to be re-created as a separate class.
5. **No connection pooling** — The app creates a new connection on each operation. Consider using a connection pool for production use.
6. **No build automation** — The project should adopt Maven or Gradle to manage dependencies and enable CLI builds.

---

## Git Workflow

- **Main branch:** `master`
- **Feature branches:** Use the `claude/<description>` naming convention for AI-assisted work.
- Commit messages are currently informal (e.g., `"10-02"`, `"w66874_w48551"`). Prefer descriptive messages.
- Push with: `git push -u origin <branch-name>`
