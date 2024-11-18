# Matrix Multiplication Multithreaded Program

This program demonstrates multithreaded matrix multiplication using both a classic multithreading approach and a thread pool approach. Each approach allows for flexible task allocation to optimize performance.

## Key Components
1. **Matrix Class**: Represents matrices and provides methods for matrix generation and output.
2. **ThreadPool Class**: Manages a pool of threads that can be reused, allowing tasks to be distributed without constantly creating and destroying threads.
3. **TaskInit Class**: Provides functions to initialize tasks based on the selected type (by row, by column, or interleaved).

## Program Parameters

- **Matrix Size**: Defined by `rowMatrix1`, `colMatrix1`, `rowMatrix2`, and `colMatrix2` constants.
- **THREAD_COUNT**: Specifies the number of threads for parallel computation.
- **Approach**:
  - `CLASSIC`: Uses individual threads for each task.
  - `THREADPOOL`: Uses a thread pool to manage tasks.
- **TaskType**:
  - `ROWS`: Assigns rows of the result matrix to different threads.
  - `COLUMNS`: Assigns columns of the result matrix to different threads.
  - `KTH` (Interleaved): Distributes matrix multiplication tasks by k-th elements, which alternates assignments across rows and columns for improved load balancing.

## Execution Process
1. **Matrix Initialization**: The program creates two matrices (`matrix1` and `matrix2`) to be multiplied and a `result` matrix to store the output.
2. **Approach Selection**:
   - `ClassicCase`: Launches `THREAD_COUNT` threads, with each handling a task based on the `TaskType`.
   - `ThreadPoolCase`: Adds tasks to a thread pool according to the specified `TaskType`.
3. **Result Output**: The program displays `matrix1`, `matrix2`, and the `result` matrix after computation, along with the computation time.

## Performance Summary (5x5 and 250x250 Matrices)
Each approach and task type's performance is summarized below:

| Matrix Size | Approach   | Task Type           | Time (seconds) |
|-------------|------------|---------------------|----------------|
| 5 x 5       | CLASSIC    | ROW                 | 0.0157        |
| 5 x 5       | CLASSIC    | COLUMN              | 0.0183        |
| 5 x 5       | CLASSIC    | K-TH ELEMENT        | 0.0296        |
| 5 x 5       | THREADPOOL | ROW                 | 0.0170        |
| 5 x 5       | THREADPOOL | COLUMN              | 0.0191        |
| 5 x 5       | THREADPOOL | K-TH ELEMENT        | 0.0228        |
| 250 x 250   | CLASSIC    | ROW                 | 2.6886        |
| 250 x 250   | CLASSIC    | COLUMN              | 2.8961        |
| 250 x 250   | CLASSIC    | K-TH ELEMENT        | 3.0479        |
| 250 x 250   | THREADPOOL | ROW                 | 2.6487        |
| 250 x 250   | THREADPOOL | COLUMN              | 2.5972        |
| 250 x 250   | THREADPOOL | K-TH ELEMENT        | 2.3519        |

## Observations
- **ThreadPool Approach**: Generally faster for larger matrices due to lower thread management overhead.
- **Task Types**:
  - **Row and Column** distributions tend to perform well, especially with thread pools.
  - **K-TH Element** (interleaved) distribution provides balanced load distribution but can increase complexity and slightly reduce performance for smaller matrices.

This documentation provides an overview of the program structure, configuration options, and performance insights across different threading approaches and task types.
