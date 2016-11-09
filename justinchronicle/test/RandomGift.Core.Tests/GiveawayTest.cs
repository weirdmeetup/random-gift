using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

using FluentAssertions;

using RandomGift.Core.Tests.Fixtures;

using Xunit;

namespace RandomGift.Core.Tests
{
    /// <summary>
    /// This represents the test entity for the <see cref="Giveaway"/> class.
    /// </summary>
    public class GiveawayTest : IClassFixture<GiveawayFixture>
    {
        private readonly string _filepath;
        private readonly IGiveaway _giveaway;

        /// <summary>
        /// Initialises a new instance of the <see cref="GiveawayTest"/> class.
        /// </summary>
        /// <param name="fixture"><see cref="GiveawayFixture"/> instance.</param>
        public GiveawayTest(GiveawayFixture fixture)
        {
            this._filepath = fixture.FilePath;
            this._giveaway = fixture.Giveaway;
        }

        /// <summary>
        /// Tests whether the method should throw an exception or not.
        /// </summary>
        [Fact]
        public void Given_NullParameter_LoadEntriesAsync_ShouldThrow_Exception()
        {
            Func<Task> func = async () => { await this._giveaway.LoadEntriesAsync(null).ConfigureAwait(false); };
            func.ShouldThrow<ArgumentNullException>();
        }

        /// <summary>
        /// Tests whether the method should throw an exception or not.
        /// </summary>
        /// <param name="filepath">Fully qualified file path.</param>
        [Theory]
        [InlineData("test.csv")]
        public void Given_InvalidFilepath_LoadEntriesAsync_ShouldThrow_Exception(string filepath)
        {
            Func<Task> func = async () => { await this._giveaway.LoadEntriesAsync(filepath).ConfigureAwait(false); };
            func.ShouldThrow<FileNotFoundException>();
        }

        /// <summary>
        /// Tests whether the method should throw an exception or not.
        /// </summary>
        /// <param name="filepath">Fully qualified file path.</param>
        [Theory]
        [InlineData("sample.csv")]
        public async void Given_ValidFilepath_LoadEntriesAsync_ShouldReturn_Result(string filepath)
        {
            await this._giveaway.LoadEntriesAsync(filepath).ConfigureAwait(false);
            this._giveaway.Entries.Count.Should().BeGreaterThan(0);
        }

        /// <summary>
        /// Tests whether the method should throw an exception or not.
        /// </summary>
        /// <param name="numberOfWinners">Number of winners.</param>
        /// <param name="numberOfEntries">Number of entries.</param>
        [Theory]
        [InlineData(0, 1)]
        [InlineData(1, 0)]
        public void Given_InvalidNumber_DrawAsync_ShouldThrow_Exception(int numberOfWinners, int numberOfEntries)
        {
            Func<Task> func = async () => { var result = await this._giveaway.DrawAsync(numberOfWinners, numberOfEntries).ConfigureAwait(false); };
            func.ShouldThrow<ArgumentOutOfRangeException>();
        }

        /// <summary>
        /// Tests whether the method should throw an exception or not.
        /// </summary>
        /// <param name="numberOfWinners">Number of winners.</param>
        /// <param name="numberOfEntries">Number of entries.</param>
        [Theory]
        [InlineData(10, 9)]
        public void Given_WrongNumber_DrawAsync_ShouldThrow_Exception(int numberOfWinners, int numberOfEntries)
        {
            Func<Task> func = async () => { var result = await this._giveaway.DrawAsync(numberOfWinners, numberOfEntries).ConfigureAwait(false); };
            func.ShouldThrow<ArgumentException>();
        }

        /// <summary>
        /// Test whether the method should return results or not.
        /// </summary>
        /// <param name="numberOfWinners">Number of winners.</param>
        /// <param name="numberOfEntries">Number of entries.</param>
        [Theory]
        [InlineData(1, 10)]
        [InlineData(2, 500)]
        public async void Given_Numbers_DrawAsync_ShouldReturn_Results(int numberOfWinners, int numberOfEntries)
        {
            var results = await this._giveaway.DrawAsync(numberOfWinners, numberOfEntries).ConfigureAwait(false);

            results.Should().HaveCount(numberOfWinners);
            results.Select(p => p.Should().BeInRange(0, numberOfEntries));
        }

        /// <summary>
        /// Tests whether the method should throw an exception or not.
        /// </summary>
        [Fact]
        public void Given_NullItems_ParseAsync_ShouldThrow_Exception()
        {
            Func<Task> func = async () => { var results = await this._giveaway.ParseResultAsync(null).ConfigureAwait(false); };
            func.ShouldThrow<ArgumentNullException>();

            func = async () => { var results = await this._giveaway.ParseResultAsync(new List<int>()).ConfigureAwait(false); };
            func.ShouldThrow<ArgumentNullException>();
        }

        /// <summary>
        /// Test whether the method should return results or not.
        /// </summary>
        /// <param name="numberOfWinners">Number of winners.</param>
        /// <param name="numberOfEntries">Number of entries.</param>
        [Theory]
        [InlineData(1, 10)]
        [InlineData(2, 500)]
        public async void Given_Items_ParseAsync_ShouldReturn_Results(int numberOfWinners, int numberOfEntries)
        {
            await this._giveaway.LoadEntriesAsync(this._filepath).ConfigureAwait(false);
            var entries = await this._giveaway.DrawAsync(numberOfWinners, numberOfEntries).ConfigureAwait(false);

            var results = await this._giveaway.ParseResultAsync(entries).ConfigureAwait(false);

            results.Should().HaveCount(numberOfWinners);
            results[0].Should().BeEquivalentTo(this._giveaway.Entries[entries[0]]);
        }
    }
}