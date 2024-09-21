import pandas as pd

def get_file_rows(file):
    rows_df = []
    if file.name.endswith('.csv'):
        rows_df = pd.read_csv(file)
    elif file.name.endswith('.xlsx'):
        rows_df = pd.read_excel(file)

    return rows_df.values.tolist() if len(rows_df) else []
