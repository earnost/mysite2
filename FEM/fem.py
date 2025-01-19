import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
import tkinter as tk
from tkinter import messagebox

# Define material properties
E = 210e9  # Young's modulus in Pascals
nu = 0.3   # Poisson's ratio

# Initialize global variables
nodes = []
elements = []
forces = []

def compute_element_stiffness(element):
    # Placeholder for element stiffness matrix computation
    return np.array([[1, 0], [0, 1]])

def assemble_global_stiffness():
    num_nodes = len(nodes)
    global_stiffness = np.zeros((2 * num_nodes, 2 * num_nodes))
    
    for element in elements:
        k = compute_element_stiffness(element)
        for i in range(len(element)):
            for j in range(len(element)):
                global_stiffness[2*element[i]:2*element[i]+2, 2*element[j]:2*element[j]+2] += k
    
    return global_stiffness

def apply_forces():
    num_nodes = len(nodes)
    force_vector = np.zeros(2 * num_nodes)
    for node_idx, force in forces:
        force_vector[2 * node_idx] += force[0]
        force_vector[2 * node_idx + 1] += force[1]
    return force_vector

def solve_fea():
    try:
        global_stiffness = assemble_global_stiffness()
        force_vector = apply_forces()
        
        # Apply boundary conditions (fix first node for simplicity)
        fixed_nodes = [0]  # Node indices with fixed boundaries
        free_nodes = [i for i in range(len(nodes)) if i not in fixed_nodes]
        
        reduced_stiffness = global_stiffness[np.ix_(2*np.array(free_nodes), 2*np.array(free_nodes))]
        reduced_forces = force_vector[2*np.array(free_nodes)]
        
        displacements = np.zeros_like(force_vector)
        displacements[2*np.array(free_nodes)] = np.linalg.solve(reduced_stiffness, reduced_forces)
        
        print('Displacements:', displacements)
        return displacements
    except Exception as e:
        messagebox.showerror("Error", str(e))
        return None

def plot_mesh():
    fig, ax = plt.subplots()
    for element in elements:
        polygon = Polygon([nodes[i] for i in element], closed=True, edgecolor='black')
        ax.add_patch(polygon)
    
    # Plot forces
    for node_idx, force in forces:
        x, y = nodes[node_idx]
        ax.arrow(x, y, force[0], force[1], head_width=10, head_length=10, fc='red', ec='red')

    ax.set_aspect('equal')
    ax.set_xlim(0, 500)
    ax.set_ylim(0, 500)
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    plt.title('2D Mesh with Forces')
    plt.show()

def update_nodes():
    global nodes
    try:
        nodes = [list(map(float, entry.get().split(','))) for entry in node_entries]
        print('Nodes updated:', nodes)
    except ValueError:
        messagebox.showerror("Error", "Invalid node input. Use format: x,y")

def update_forces():
    global forces
    try:
        forces = [(int(idx), list(map(float, entry.get().split(',')))) for idx, entry in enumerate(force_entries)]
        print('Forces updated:', forces)
    except ValueError:
        messagebox.showerror("Error", "Invalid force input. Use format: fx,fy")

def run_gui():
    global node_entries, force_entries
    
    root = tk.Tk()
    root.title("2D FEA Solver")
    
    # Node inputs
    tk.Label(root, text="Nodes (x,y):").pack()
    node_entries = []
    for i in range(4):  # Assuming a maximum of 4 nodes
        entry = tk.Entry(root)
        entry.pack()
        node_entries.append(entry)
    
    tk.Button(root, text="Update Nodes", command=update_nodes).pack(pady=10)
    
    # Force inputs
    tk.Label(root, text="Forces (fx,fy) at nodes (node index):").pack()
    force_entries = []
    for i in range(4):  # Assuming a maximum of 4 forces
        entry = tk.Entry(root)
        entry.pack()
        force_entries.append(entry)
    
    tk.Button(root, text="Update Forces", command=update_forces).pack(pady=10)
    
    tk.Button(root, text="Draw Mesh", command=plot_mesh).pack(pady=10)
    tk.Button(root, text="Solve FEA", command=solve_fea).pack(pady=10)
    
    root.mainloop()

if __name__ == "__main__":
    run_gui()
