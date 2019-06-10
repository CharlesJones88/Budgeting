defmodule BudgetingWeb.TransactionView do
  use BudgetingWeb, :view
  alias BudgetingWeb.TransactionView

  def render("index.json", page) do
    %{
      transactions: render_many(page.transactions, TransactionView, "transaction.json"),
      pageNumber: page.page_number,
      count: page.page_size,
      totalPages: page.total_pages,
      totalEntries: page.total_entries
    }
  end

  def render("show.json", %{transaction: transaction}) do
    %{data: render_one(transaction, TransactionView, "transaction.json")}
  end

  def render("categories.json", %{transactions: transactions}) do
    %{data: render_many(transactions, TransactionView, "categories.json")}
  end

  def render("categories.json", %{transaction: transaction}) do
    %{
      category: transaction.category,
      amount: transaction.amount
    }
  end

  def render("transaction.json", %{transaction: transaction}) do
    %{id: transaction.id,
      category: transaction.category,
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date}
  end
end
