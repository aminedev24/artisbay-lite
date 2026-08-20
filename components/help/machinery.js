import React from 'react';
import Link from 'next/link';

const MachineryService = () => {
  return (
    <div className="envirement-policy">

      <h4>Machinery Sourcing</h4>

      <p>
        At Meridian Motors Inc., we source machinery through two complementary channels — direct access to Japanese auctions and an exclusive network of domestic partners who do not have the ability to export or reach overseas markets on their own.
      </p>

      <h4>Direct Auction Sourcing</h4>
      <p>
        We participate in Japan's leading machinery and heavy equipment auctions, giving our clients access to a wide range of units — construction equipment, agricultural machinery, industrial tools, and more — at competitive auction prices. Every unit we acquire goes through our standard inspection and documentation process before export.
      </p>

      <h4>Partner Network</h4>
      <p>
        Many of Japan's dealers, dismantlers, and equipment owners operate exclusively in the domestic market. They have quality stock but no export licence, no overseas contacts, and no knowledge of international logistics. Meridian Motors Inc. bridges that gap. Through our established relationships with these partners, we can source machinery that never appears on public auction platforms — giving our clients access to inventory unavailable anywhere else.
      </p>

      <h4>What We Can Source</h4>
      <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', lineHeight: '2' }}>
        <li>Construction equipment (excavators, bulldozers, cranes, loaders)</li>
        <li>Agricultural machinery (tractors, harvesters, cultivators)</li>
        <li>Forklifts and warehouse equipment</li>
        <li>Road maintenance and paving machinery</li>
        <li>Industrial generators and compressors</li>
        <li>Dismantled parts and attachments</li>
      </ul>

      <h4>How It Works</h4>
      <p>
        Send us your requirement — make, model, year range, condition, and target budget — and our team will search both auction platforms and our partner network on your behalf. We handle the full export process: inspection, documentation, shipping arrangements, and customs paperwork.
      </p>

      <p>
        Whether you need a single unit or a bulk consignment, we are here to find the right machine at the right price and deliver it to your port safely.
      </p>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 font-semibold rounded transition-colors duration-300"
          style={{ background: 'var(--primary-color)', color: '#fff' }}
        >
          Send Us Your Requirement
        </Link>
      </div>

    </div>
  );
};

export default MachineryService;
