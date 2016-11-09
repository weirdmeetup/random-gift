using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace RandomGift.Core
{
    /// <summary>
    /// This provides interfaces to the <see cref="Giveaway"/> class.
    /// </summary>
    public interface IGiveaway : IDisposable
    {
        /// <summary>
        /// Gets the list of entries.
        /// </summary>
        List<string> Entries { get; }

        /// <summary>
        /// Loads the list of entries from the given .csv file.
        /// </summary>
        /// <param name="filepath">Fully qualified file path.</param>
        Task LoadEntriesAsync(string filepath);

        /// <summary>
        /// Draws the winning numbers based on the number of entries.
        /// </summary>
        /// <param name="numberOfWinners">Number of winners.</param>
        /// <param name="numberOfEntries">Number of entries.</param>
        /// <returns>Returns the list of winners.</returns>
        Task<List<int>> DrawAsync(int numberOfWinners, int numberOfEntries);

        /// <summary>
        /// Parses the drawn results to entries.
        /// </summary>
        /// <param name="items">List of drawn results.</param>
        /// <returns>Returns the list of entries drawn.</returns>
        /// <exception cref="ArgumentNullException"><paramref name="items"/> is <see langword="null" />.</exception>
        Task<List<string>> ParseResultAsync(List<int> items);
    }
}