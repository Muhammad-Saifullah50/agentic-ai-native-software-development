# Stage 1: Build stage
FROM python:3.13-slim as builder

WORKDIR /app

# Install poetry
RUN pip install poetry

# Copy poetry files
COPY poetry.lock pyproject.toml ./

# Install dependencies
RUN poetry install --no-dev --no-interaction --no-ansi

# Stage 2: Final stage
FROM python:3.13-slim

WORKDIR /app

# Copy installed dependencies from builder stage
COPY --from=builder /app/.venv /.venv

# Add the virtual environment to the PATH
ENV PATH="/app/.venv/bin:$PATH"

# Copy the application code
COPY . .

# Command to run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
