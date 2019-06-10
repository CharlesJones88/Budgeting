# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Budgeting.Repo.insert!(%Budgeting.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias Budgeting.Repo
alias Budgeting.Directory.Transaction

Repo.insert! %Transaction{ description: "GOOGLE", category: "Entertainment", date: Date.utc_today(), amount: -69.00 }
Repo.insert! %Transaction{ description: "AMAZON", category: "Entertainment", date: Date.utc_today(), amount: -32.10 }

