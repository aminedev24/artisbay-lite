import React, { useState } from "react";
import shippingData from './shippingData.json';

const Shipping = () => {
  const [search, setSearch] = useState('');

  const filtered = search
    ? shippingData.filter(e =>
        e.company.toLowerCase().includes(search.toLowerCase()) ||
        e.vessel.toLowerCase().includes(search.toLowerCase())
      )
    : shippingData;

  return (
    <div className="branch-content">
      <div className="p8block border-0" id="shipping-schedule">
        <h2 className="cate-title_n">Shipping Schedule</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Search by company or vessel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: 4,
              fontSize: 14,
              color: '#222',
              background: '#fff',
              width: '100%',
              maxWidth: 400,
              outline: 'none'
            }}
          />
        </div>
        <div className="shipping-list">
          {filtered.map((entry, idx) => (
            <section key={idx} className="shipping">
              <div className="shipping_info shipstatus">
                <div>{entry.company}</div>
                <div>{entry.vessel}</div>
                <div className="shipping_ro-ro">
                  {entry.type === 'ro-ro' ? 'RO-RO' : 'CONTAINER'}
                </div>
              </div>
              <div className="shipping_info shipdate">
                <div>
                  <div className="font-weight-bold">Leave</div>
                  {entry.leavePorts.map((p, i) => (
                    <div key={i} className={`shipping_port${p.isCut ? ' cut_date' : ''}`}>
                      <div>{p.date}</div>
                      <div>{p.port}</div>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-weight-bold">Arrive</div>
                  {entry.arrivePorts.map((p, i) => (
                    <div key={i} className={`shipping_port${p.isCut ? ' cut_date' : ''}`}>
                      <div>{p.date}</div>
                      <div>{p.port}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
      <style jsx>{`
        #shipping-schedule {
          margin: 0 auto;
          max-width: 1200px;
          padding: 16px;
        }
        .cate-title_n {
          font-size: 22px;
          font-weight: 700;
          color: #000 !important;
          margin: 0 0 16px 0;
        }
        .shipping-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .shipping {
          border: 1px solid #999;
          border-radius: 6px;
          background: #fff;
          overflow: hidden;
        }
        .shipping_info {
          padding: 10px 14px;
        }
        .shipping_info.shipstatus {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          background: #eee;
          border-bottom: 1px solid #ddd;
        }
        .shipping_info.shipstatus > div:first-child {
          font-weight: 700;
          font-size: 14px;
          color: #1e3a8a !important;
        }
        .shipping_info.shipstatus > div:nth-child(2) {
          font-size: 14px;
          color: #000 !important;
          flex: 1;
          font-weight: 500;
        }
        .shipping_ro-ro {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #e8f5e9;
          color: #2e7d32 !important;
          border: 1px solid #c8e6c9;
        }
        .shipping_info.shipdate {
          display: flex;
          gap: 24px;
          padding: 10px 14px;
        }
        .shipping_info.shipdate > div {
          flex: 1;
        }
        .font-weight-bold {
          font-weight: 700;
          font-size: 12px;
          color: #000 !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }
        .shipping_port {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 4px 10px;
          margin: 3px 4px 3px 0;
          font-size: 13px;
          color: #000 !important;
        }
        .shipping_port > div:first-child {
          color: #d32f2f !important;
          font-weight: 600;
          white-space: nowrap;
        }
        .shipping_port > div:nth-child(2) {
          color: #000 !important;
          font-weight: 500;
        }
        .shipping_port.cut_date {
          background: #fff3e0;
          border-color: #ffcc80;
        }
        .shipping_port.cut_date > div:first-child {
          color: #e65100 !important;
        }
        .shipping_port.cut_date > div:nth-child(2) {
          color: #bf360c !important;
        }
        @media (max-width: 768px) {
          .shipping_info.shipdate {
            flex-direction: column;
            gap: 12px;
          }
          .cate-title_n {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default Shipping;
