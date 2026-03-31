Here’s your **new GitHub README (clean + ready to paste)** replacing the default Next.js one 👇

---

# Advertisement Budget Optimization Dashboard

## Overview

This project demonstrates an algorithm-driven approach to optimizing advertisement budget allocation using Dynamic Programming and Greedy techniques.

It combines a high-performance C-based computation engine with an interactive web dashboard for visualization and analysis.

---

## Running the Project

### Objective

Run a local instance of the Advertisement Budget Optimization dashboard.

### Prerequisites

* Python installed on your system

### Steps

1. Navigate to the project directory:


2. Start the local development server:

```
python -m http.server 8080
```

3. Open the dashboard in your browser:

```
http://localhost:8080/code.html
```

---

## Project Structure

The project follows a decoupled architecture separating computation and visualization.

### Backend (C - Algorithm Engine)

* `src/main.c` → Entry point for executing tests
* `src/dp.c` → Dynamic Programming (0-1 Knapsack) implementation
* `src/greedy.c` → Greedy heuristic based on engagement-to-cost ratio
* `src/simulation.c` → Statistical simulation engine

### Frontend (Web Dashboard)

* `code.html` → UI built with HTML5 and Tailwind CSS
* `script.js` → Handles data processing and visualization

---

## Workflow

### Stage 1: Computation

* Processes constraints (e.g., ₹5000 budget, 30 ads)
* Compares Dynamic Programming vs Greedy approach
* Runs simulations to generate statistical metrics

### Stage 2: Visualization

* Uses precomputed data from C programs
* Displays results through an interactive dashboard
* Supports:

  * Case Study view (detailed selection)
  * Simulation view (statistical comparison)

---

## Key Insights

### Dynamic Programming (DP)

* Achieves optimal budget utilization
* Maximizes total engagement

### Greedy Approach

* Faster but suboptimal
* Leaves unused budget in many cases

### Conclusion

Dynamic Programming consistently outperforms the Greedy approach, making it the preferred method for budget-constrained advertisement optimization.

---

## Tech Stack

* C (Algorithms & Simulation)
* HTML, Tailwind CSS (Frontend UI)
* JavaScript (Visualization Logic)
* Python HTTP Server (Local Hosting)

---

## Future Improvements

* Real-time backend integration
* API-based data flow instead of static embedding
* ML-based ad performance prediction
* Deployment with live dashboard

---

