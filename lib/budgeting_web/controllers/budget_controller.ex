defmodule BudgetingWeb.BudgetController do
  use BudgetingWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end