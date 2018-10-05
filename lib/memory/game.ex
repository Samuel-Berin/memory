defmodule Memory.Game do

  def new do
    %{
      score: 0,
      firstGuess: "",
      firstGuessPos: -1,
      secondGuess: "",
      board: new_board(),
      revealed: [],
    }
  end

  def client_view(game) do
    %{
      score: 0,
      firstGuess: "",
      firstGuessPos: -1,
      secondGuess: "",
      board: new_board(),
      revealed: [],
    }
  end

  def new_board() do
    letters = ["A", "A", "B", "B", "C", "C",
     "D","D", "E", "E", "F", "F", "G", "G", "H", "H"]

    Enum.shuffle(letters)
  end

  def restart() do
    %{
      score: 1,
    }
  end

  def guess(pos) do
    # If this is our first guess, reveal it and store it
    if :firstGuess == "" do
      :firstGuess = Enum.at(:board, pos)
      :revealed = [pos | :board]
      :firstGuessPos = pos
    else
      :secondGuess = Enum.at(:board, pos)
      # The letters match!
      if :secondGuess == :firstGuess do
        :revealed = [pos | :board]
      # The letters don't match :(
      else
        :revealed = [pos | :board]
        # WAIT!
        List.delete(:revealed, pos)
        List.delete(:revealed, :firstGuessPos)
      end
      :firstGuess = ""
      :firstGuessPos = -1
      :secondGuess = ""
    end


  end
end
