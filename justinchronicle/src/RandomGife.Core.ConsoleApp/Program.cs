using System;
using System.Linq;
using System.Threading.Tasks;

using RandomGift.Core;

namespace RandomGife.Core.ConsoleApp
{
    /// <summary>
    /// This represents the entity of the console application.
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Performs the console application.
        /// </summary>
        /// <param name="args">List of arguments fro user input.</param>
        public static void Main(string[] args)
        {
            if (args == null || !args.Any())
            {
                Console.WriteLine("No file name!");
                return;
            }

            if (!args[0].ToLowerInvariant().EndsWith(".csv"))
            {
                Console.WriteLine("Invalid CSV file!");
                return;
            }

            int numberOfWinners;
            if (!int.TryParse(args[1], out numberOfWinners))
            {
                Console.WriteLine("Invalid number of winners!");
                return;
            }

            var result = ProcessAsync(args[0], Convert.ToInt32(args[1])).Result;
        }

        private static async Task<int> ProcessAsync(string filepath, int numberOfWinners)
        {
            using (var ga = new Giveaway())
            {
                await ga.LoadEntriesAsync(filepath).ConfigureAwait(false);
                var entries = await ga.DrawAsync(numberOfWinners, ga.Entries.Count).ConfigureAwait(false);
                var winners = await ga.ParseResultAsync(entries).ConfigureAwait(false);

                Console.WriteLine(string.Join("\n", winners.Select((p, i) => $"{i + 1}: {p}")));
            }

            return 0;
        }
    }
}
