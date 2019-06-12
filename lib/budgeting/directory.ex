defmodule Budgeting.Directory do
  @moduledoc """
  The Directory context.
  """

  import Ecto.Query, warn: false
  use Ecto.Schema
  alias Budgeting.Repo

  alias Budgeting.Directory.Transaction

  @doc """
  Returns the list of transactions.

  ## Examples

      iex> list_transactions()
      [%Transaction{}, ...]

  """
  def list_transactions do
    Repo.all(Transaction)
  end

  def list_transactions(params) do
    limit = String.to_integer(params["count"])
    offset = (String.to_integer(params["page"]) - 1) * limit
    offset = if offset < 0 do
      0
    else
      offset
    end
    query = from(t in Transaction, select: t)
      |> limit(^limit) 
      |> offset(^offset)
    query =
      if is_binary(params["sortOrder"]) and is_binary(params["sortField"]) do
        direction = String.to_atom(params["sortOrder"])
        sort_field = String.to_atom(params["sortField"])
        query 
          |> order_by([query], {^direction, ^sort_field})
      else
        query
      end
    query = 
      if is_binary(params["search"]) do
        like_term = "%#{params["search"]}%"
        query |> where([t], 
          like(fragment("lower(?)", t.description), fragment("lower(?)", ^like_term)) 
          or like(fragment("lower(?)", t.category), fragment("lower(?)", ^like_term)))
      else
        query
      end
    Repo.all(query)  
  end

  def count_transactions(params) do
    query = from(t in Transaction, select: count(t.id))
    query =
      if is_binary(params["search"]) do
        like_term = "%#{params["search"]}%"
        query |> where([t], like(fragment("lower(?)", t.description), fragment("lower(?)", ^like_term)) 
        or like(fragment("lower(?)", t.category), fragment("lower(?)", ^like_term)))
      else
        query 
      end
    Repo.one(query)
  end

  @doc """
  Gets a single transaction.

  Raises `Ecto.NoResultsError` if the Transaction does not exist.

  ## Examples

      iex> get_transaction!(123)
      %Transaction{}

      iex> get_transaction!(456)
      ** (Ecto.NoResultsError)

  """
  def get_transaction!(id), do: Repo.get!(Transaction, id)

  @doc """
  Creates a transaction.

  ## Examples

      iex> create_transaction(%{field: value})
      {:ok, %Transaction{}}

      iex> create_transaction(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_transaction(attrs \\ %{}) do
    %Transaction{}
    |> Transaction.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a transaction.

  ## Examples

      iex> update_transaction(transaction, %{field: new_value})
      {:ok, %Transaction{}}

      iex> update_transaction(transaction, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_transaction(%Transaction{} = transaction, attrs) do
    transaction
    |> Transaction.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a Transaction.

  ## Examples

      iex> delete_transaction(transaction)
      {:ok, %Transaction{}}

      iex> delete_transaction(transaction)
      {:error, %Ecto.Changeset{}}

  """
  def delete_transaction(%Transaction{} = transaction) do
    Repo.delete(transaction)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking transaction changes.

  ## Examples

      iex> change_transaction(transaction)
      %Ecto.Changeset{source: %Transaction{}}

  """
  def change_transaction(%Transaction{} = transaction) do
    Transaction.changeset(transaction, %{})
  end
end
