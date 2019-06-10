defmodule Budgeting.Directory.Transaction do
  use Ecto.Schema
  import Ecto.Changeset

  schema "transactions" do
    field :amount, :float
    field :category, :string
    field :date, :date
    field :description, :string

    timestamps()
  end

  @doc false
  def changeset(transaction, attrs) do
    transaction
    |> cast(attrs, [:category, :description, :amount, :date])
    |> validate_required([:category, :description, :amount, :date])
  end
end
