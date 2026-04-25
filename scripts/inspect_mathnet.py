from datasets import load_dataset

ds = load_dataset("ShadenA/MathNet")
ds = ds.cast_column("images", ds["train"].features["images"])

print(ds)
print("\nSplits:", list(ds.keys()))

split = list(ds.keys())[0]
print("\nFirst split:", split)
print("\nColumns:", ds[split].column_names)

print("\nFirst examples without images:")
for i in range(3):
    row = ds[split].select([i]).remove_columns(["images"])[0]

    print(f"\n================ EXAMPLE {i} ================")
    for k, v in row.items():
        print(f"\n--- {k} ---")
        print(str(v)[:1000])