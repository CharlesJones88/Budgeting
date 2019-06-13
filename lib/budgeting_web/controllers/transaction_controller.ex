defmodule BudgetingWeb.TransactionController do
  use BudgetingWeb, :controller

  alias Budgeting.Directory
  alias Budgeting.Directory.Transaction

  action_fallback BudgetingWeb.FallbackController

  def index(conn, params) do
    total_entries = Directory.count_transactions(params)
    total_pages = ceil(total_entries / String.to_integer(params["count"]))
    page = params["page"]
    params = 
      if String.to_integer(page) > total_pages do
        page_count = total_pages |> Integer.to_string()
        Map.put(params, "page", page_count)
      else
        params
      end
    transactions = Directory.list_transactions(params)
    render(conn, :index, %{transactions: transactions, total_entries: total_entries, page_number: String.to_integer(params["page"]), page_size: String.to_integer(params["count"]), total_pages: total_pages})
  end

  def create(conn, %{"transaction" => transaction_params}) do
    if Map.has_key?(transaction_params, :__struct__) do
      File.stream!(transaction_params.path) 
      |> CSV.decode!
      |> Stream.drop(1)
      |> Enum.map(fn
        [category, description, amount, date] -> 
          Directory.create_transaction(%{ category: category, description: description, amount: amount, date: date })
      end)
      send_resp(conn, :no_content, "")
    else
      with {:ok, %Transaction{} = transaction} <- Directory.create_transaction(transaction_params) do
        conn
        |> put_status(:created)
        |> put_resp_header("location", Routes.transaction_path(conn, :show, transaction))
        |> render("show.json", transaction: transaction)
      end
    end
  end

  def categories(conn, _params) do
    transactions = Directory.list_transactions()
    render(conn, "categories.json", transactions: transactions)
  end

  def show(conn, %{"id" => id}) do
    transaction = Directory.get_transaction!(id)
    render(conn, "show.json", transaction: transaction)
  end

  def update(conn, %{"id" => id, "transaction" => transaction_params}) do
    transaction = Directory.get_transaction!(id)

    with {:ok, %Transaction{} = transaction} <- Directory.update_transaction(transaction, transaction_params) do
      render(conn, "show.json", transaction: transaction)
    end
  end

  def delete(conn, %{"id" => id}) do
    transaction = Directory.get_transaction!(id)

    with {:ok, %Transaction{}} <- Directory.delete_transaction(transaction) do
      send_resp(conn, :no_content, "")
    end
  end
end
