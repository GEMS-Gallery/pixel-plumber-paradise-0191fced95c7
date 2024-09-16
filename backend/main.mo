import Func "mo:base/Func";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Order "mo:base/Order";
import Iter "mo:base/Iter";

actor {
  // Stable variable to store high scores across upgrades
  stable var highScores : [(Text, Nat)] = [];

  // Function to add a new high score
  public func addHighScore(name : Text, score : Nat) : async () {
    highScores := Array.sort(
      Array.append(highScores, [(name, score)]),
      func (a : (Text, Nat), b : (Text, Nat)) : Order.Order {
        if (b.1 > a.1) { #less } else if (b.1 < a.1) { #greater } else { #equal }
      }
    );
    // Keep only top 10 scores
    if (highScores.size() > 10) {
      let newHighScores = Array.init<(Text, Nat)>(10, ("", 0));
      for (i in Iter.range(0, 9)) {
        newHighScores[i] := highScores[i];
      };
      highScores := Array.freeze(newHighScores);
    };
  };

  // Function to get high scores
  public query func getHighScores() : async [(Text, Nat)] {
    highScores
  };
}
