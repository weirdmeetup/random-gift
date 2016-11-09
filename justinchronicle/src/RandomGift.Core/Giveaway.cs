using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace RandomGift.Core
{
    /// <summary>
    /// This represents the entity for giveaway draw
    /// </summary>
    public class Giveaway : IGiveaway
    {
        private bool _disposed;

        /// <summary>
        /// Initialises a new instance of the <see cref="Giveaway"/> class.
        /// </summary>
        public Giveaway()
        {
            this.Entries = new List<string>();
        }

        /// <summary>
        /// Gets the list of entries.
        /// </summary>
        public List<string> Entries { get; private set; }

        /// <summary>
        /// Loads the list of entries from the given .csv file.
        /// </summary>
        /// <param name="filepath">Fully qualified file path.</param>
        /// <exception cref="ArgumentNullException"><paramref name="filepath"/> is <see langword="null" />.</exception>
        /// <exception cref="FileNotFoundException"><paramref name="filepath"/> doesn't exist.</exception>
        public async Task LoadEntriesAsync(string filepath)
        {
            if (string.IsNullOrWhiteSpace(filepath))
            {
                throw new ArgumentNullException(nameof(filepath));
            }

            if (!File.Exists(filepath))
            {
                throw new FileNotFoundException();
            }

            var entries = await Task.Factory
                                    .StartNew(() => File.ReadAllLines(filepath).Where(p => p.Contains("@")).ToList())
                                    .ConfigureAwait(false);

            this.Entries = entries;
        }

        /// <summary>
        /// Draws the winning numbers based on the number of entries.
        /// </summary>
        /// <param name="numberOfWinners">Number of winners.</param>
        /// <param name="numberOfEntries">Number of entries.</param>
        /// <returns>Returns the list of winners.</returns>
        /// <exception cref="ArgumentOutOfRangeException"><paramref name="numberOfWinners"/> must be greater than zero.</exception>
        /// <exception cref="ArgumentOutOfRangeException"><paramref name="numberOfEntries"/> must be greater than zero.</exception>
        /// <exception cref="ArgumentException">Number of entries must be greater than or equal to the number of winners.</exception>
        public async Task<List<int>> DrawAsync(int numberOfWinners, int numberOfEntries)
        {
            if (numberOfWinners <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(numberOfWinners));
            }

            if (numberOfEntries <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(numberOfEntries));
            }

            if (numberOfWinners > numberOfEntries)
            {
                throw new ArgumentException("Number of entries must be greater than or equal to the number of winners.");
            }

            var results = await Task.Factory.StartNew(() => this.Draw(numberOfWinners, numberOfEntries)).ConfigureAwait(false);

            return results;
        }

        /// <summary>
        /// Parses the drawn results to entries.
        /// </summary>
        /// <param name="items">List of drawn results.</param>
        /// <returns>Returns the list of entries drawn.</returns>
        /// <exception cref="ArgumentNullException"><paramref name="items"/> is <see langword="null" />.</exception>
        public async Task<List<string>> ParseResultAsync(List<int> items)
        {
            if (items == null || !items.Any())
            {
                throw new ArgumentNullException(nameof(items));
            }

            var entries = await Task.Factory
                                    .StartNew(() => items.Select(p => this.Entries[p]).ToList())
                                    .ConfigureAwait(false);
            return entries;
        }

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            if (this._disposed)
            {
                return;
            }

            this._disposed = true;
        }

        private List<int> Draw(int numberOfWinners, int numberOfEntries)
        {
            var results = new List<int>();
            while (results.Count < numberOfWinners)
            {
                var result = BitConverter.ToInt64(Guid.NewGuid().ToByteArray(), 0) % numberOfEntries;
                if (!results.Contains((int)result))
                {
                    results.Add((int)result);
                }
            }

            return results;
        }
    }
}