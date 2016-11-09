using System;

namespace RandomGift.Core.Tests.Fixtures
{
    /// <summary>
    /// This represents the fixture entity for the <see cref="GiveawayTest"/> class.
    /// </summary>
    public class GiveawayFixture : IDisposable
    {
        private bool _disposed;

        /// <summary>
        /// Initialises a new instance of the <see cref="GiveawayFixture"/> class.
        /// </summary>
        public GiveawayFixture()
        {
            this.Giveaway = new Giveaway();
        }

        /// <summary>
        /// Gets the fully qualified file path.
        /// </summary>
        public string FilePath => "sample.csv";

        /// <summary>
        /// Gets the <see cref="IGiveaway"/> instance.
        /// </summary>
        public IGiveaway Giveaway { get; }

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
    }
}
