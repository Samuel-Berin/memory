defmodule MemoryWeb.PageController do
  use MemoryWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end

  # From Nat's lecture notes
  def game(conn, params) do
  render conn, "game.html", game: params["game"]
  end
end
