defmodule Budgeting.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  def start(_type, _args) do
    # List all child processes to be supervised
    children = [
      # Start the Ecto repository
      Budgeting.Repo,
      # Start the endpoint when the application starts
      BudgetingWeb.Endpoint
      # Starts a worker by calling: Budgeting.Worker.start_link(arg)
      # {Budgeting.Worker, arg},
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Budgeting.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    BudgetingWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
