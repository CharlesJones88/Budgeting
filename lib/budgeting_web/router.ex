defmodule BudgetingWeb.Router do
  use BudgetingWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/api", BudgetingWeb do
    pipe_through :api
    get "/transactions/categories", TransactionController, :categories

    resources "/transactions", TransactionController, except: [:new, :edit]
  end

  scope "/", BudgetingWeb do
    pipe_through :browser

    get "/", BudgetController, :index
  end

  # Other scopes may use custom stacks.
  # scope "/api", BudgetingWeb do
  #   pipe_through :api
  # end
end
