# Yu-Gi-Oh! Deck Viewer

A web-based Yu-Gi-Oh! deck viewing application that allows duelists to load and analyze deck files.

🔗 [Live Demo](https://Yeet195.github.io/DeckViewer/)

## Features

- Load YDK format deck files directly from your computer
- Import decks from YDKE URLs
- View detailed card information and images
- Analyze deck statistics including:
  - Card type distribution
  - Monster attributes
  - Monster types
  - Level/Rank distribution
- Copy deck list to CardMarket format for easy purchasing
- Responsive design that works on desktop and mobile devices
- No server-side dependencies - runs entirely in your browser

## Supported Formats

- **YDK Files**: The standard deck file format used by YGOPro, EDOPro, and other simulators
- **YDKE URLs**: The URL format used by platforms like DuelingBook and some online communities
- **Omega Format**: *(Planned for future update)*

## How to Use

### Loading a Deck

1. Click the "Open YDK" button to select a YDK file from your computer
2. Or click "Import From Text" to paste a YDKE URL

### Viewing Cards

- Click on any card image to view detailed information about that card
- Cards with multiple copies will show a number in the top-right corner

### Copying to CardMarket

- Click the "Copy CardMarket Wants List" button to copy the deck in a format ready to paste into CardMarket's wants list

## Technical Details

This application runs entirely client-side using:

- HTML5, CSS3, and JavaScript
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Font Awesome](https://fontawesome.com/) for icons
- [YGOProDeck API](https://db.ygoprodeck.com/api/v7/cardinfo.php) for card data and images

No data is stored on servers - all processing happens in your browser.

## Privacy

This application:
- Does not collect any personal data
- Does not track your usage
- Does not send your deck information to any server (other than API calls to fetch card images and data)
- All deck data remains in your browser

## Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Plans

- Card price information
- Deck export to other formats
- Support for Screen-Shots

## Disclaimer

This is an unofficial application and is not affiliated with, sponsored by, or endorsed by Konami or any other entity owning the intellectual property rights related to Yu-Gi-Oh!. All card images and data are the property of their respective owners.

Yu-Gi-Oh! and all related terms are registered trademarks of Konami.

## License

This project is licensed under the GNU GENERAL PUBLIC LICENSE - see the LICENSE file for details.