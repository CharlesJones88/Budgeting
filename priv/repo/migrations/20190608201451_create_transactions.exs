defmodule Budgeting.Repo.Migrations.CreateTransactions do
  use Ecto.Migration

  def change do
    create table(:transactions) do
      add :category, :string
      add :description, :text
      add :amount, :float
      add :date, :date

      timestamps()
    end

  end
end
