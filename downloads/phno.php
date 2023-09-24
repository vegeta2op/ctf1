# Define the range of numbers
start_number = 10000000000
end_number = 19999999999

# Generate the list of numbers
numbers = list(range(start_number, end_number + 1))

# Define the name of the output file
output_file = "number_list.txt"

# Write the list of numbers to the file
with open(output_file, "w") as file:
    for number in numbers:
        file.write(str(number) + "\n")

print(f"Numbers from {start_number} to {end_number} have been saved to {output_file}.")
