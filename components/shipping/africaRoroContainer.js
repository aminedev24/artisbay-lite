import React, { useState, useEffect } from 'react';

const AfricaRoroShippingTable = () => {
  const [shippingData, setShippingData] = useState([]);

  const columns = [
    'Company', 'Ship Name', 'Voyage', 'Yokohama', 'Kawasaki', 'Nagoya', 'Kobe', 
    'Osaka', 'Hakata', 'Kanda', 'Kisarazu', 'Nakanoseki', 'Hitachinaka', 
    'Jebel Ali', 'Karachi', 'Port Louis', 'Durban', 'Dar', 'Mombasa', 'Maput', 
    'Hambantota'
  ];

  const htmlTable = `<div id="list"><table class="main_h"><tbody><tr id="head_nh"><td>Company</td><td>Ship Name</td><td>Voyage</td><td>Yoko-<br>hama</td><td>Kawa-<br>saki</td><td>Nagoya</td><td>Kobe</td><td>Osaka</td><td>Hakata</td><td>Kanda</td><td>Kisa-<br>razu</td><td>Nakano-<br>seki</td><td>Hitachi-<br>naka</td><td>Jebel Ali</td><td>Karachi</td><td>Port Louis</td><td>Durban</td><td>Dar</td><td>Mombasa</td><td>Maput</td><td>Hambantota</td>        </tr></tbody></table><div class="ship_c"><table class="main">
<tbody><tr class="row" bgcolor="#ffffff" nowrap=""><td>NYK</td><td>JUPITER LEADER</td><td>069</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Feb<br>13</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>16</td><td>Mar<br>9</td><td>Mar<br>7</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>NYK</td><td>TAURUS LEADER</td><td>078</td><td>Feb<br>14</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>5</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>MOL</td><td>PRIME ACE</td><td>0088A</td><td>Feb<br>17</td><td>-</td><td>Feb<br>11</td><td>Feb<br>19</td><td>-</td><td>-</td><td>-</td><td>Feb<br>13</td><td>Feb<br>20</td><td>-</td><td>-</td><td>-</td><td>Mar<br>2</td><td>Mar<br>7</td><td>Mar<br>13</td><td>Mar<br>17</td><td>Mar<br>9</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>MOL(SUN PHOENIX）</td><td>MARTORELL</td><td>0173A</td><td>Feb<br>17</td><td>-</td><td>Feb<br>16</td><td>-</td><td>Feb<br>15</td><td>-</td><td>-</td><td>Feb<br>18</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>7</td><td>-</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>NYK</td><td>OCEANUS LEADER</td><td>090</td><td>-</td><td>-</td><td>Feb<br>17</td><td>Feb<br>19</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>12</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>NYK</td><td>HEROIC LEADER</td><td>094</td><td>Feb<br>20</td><td>-</td><td>Feb<br>22</td><td>Feb<br>24</td><td>Feb<br>23</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>22</td><td>Mar<br>16</td><td>Mar<br>14</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>THE KEIHIN CO., LTD.</td><td>MORNING CARINA</td><td>163</td><td>Feb<br>23</td><td>-</td><td>Feb<br>24</td><td>Feb<br>25</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>20</td><td>Mar<br>23</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>SEVEN SEALS CO.,LTD</td><td>GEORGIA HIGHWAY</td><td>122</td><td>Feb<br>25</td><td>-</td><td>Feb<br>27</td><td>Mar<br>2</td><td>Mar<br>1</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>28</td><td>Mar<br>27</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>SEVEN SEALS CO.,LTD(INTEROCEAN)</td><td>GEORGIA HIGHWAY</td><td>122</td><td>Feb<br>25</td><td>-</td><td>Feb<br>27</td><td>Mar<br>2</td><td>Mar<br>1</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>25</td><td>Mar<br>24</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>MOL(SUN PHOENIX）</td><td>ONYX ACE</td><td>109A</td><td>Mar<br>3</td><td>-</td><td>Mar<br>2</td><td>Feb<br>28</td><td>-</td><td>-</td><td>-</td><td>Feb<br>25</td><td>Feb<br>27</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>23</td><td>Mar<br>29</td><td>Apr<br>1</td><td>Mar<br>25</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>MOL</td><td>ONYX ACE</td><td>109A</td><td>Mar<br>3</td><td>-</td><td>Mar<br>2</td><td>Feb<br>28</td><td>-</td><td>-</td><td>-</td><td>Feb<br>25</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>23</td><td>Mar<br>29</td><td>Apr<br>1</td><td>Mar<br>25</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>THE KEIHIN CO., LTD.</td><td>GRAND PAVO</td><td>126</td><td>Mar<br>6</td><td>-</td><td>Mar<br>7</td><td>Mar<br>8</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>5</td><td>-</td><td>-</td><td>-</td><td>Apr<br>12</td><td>Apr<br>3</td><td>Apr<br>6</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>MOL</td><td>SUNRISE ACE</td><td>0131A</td><td>Mar<br>12</td><td>-</td><td>Mar<br>11</td><td>Mar<br>15</td><td>-</td><td>-</td><td>-</td><td>Mar<br>13</td><td>Mar<br>16</td><td>-</td><td>-</td><td>-</td><td>Mar<br>31</td><td>Apr<br>6</td><td>Apr<br>13</td><td>Apr<br>15</td><td>Apr<br>7</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>MOL(SUN PHOENIX）</td><td>SUNRISE ACE</td><td>0131A</td><td>Mar<br>12</td><td>-</td><td>Mar<br>11</td><td>Mar<br>15</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>O</td><td>O</td><td>Apr<br>7</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>NYK</td><td>IRIS LEADER</td><td>073</td><td>Mar<br>14</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>2</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>NYK</td><td>GUARDIAN LEADER</td><td>121</td><td>Mar<br>15</td><td>-</td><td>Mar<br>17</td><td>Mar<br>21</td><td>Mar<br>20</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>21</td><td>Apr<br>15</td><td>Apr<br>13</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>THE KEIHIN CO., LTD.</td><td>TANABATA</td><td>001</td><td>Mar<br>15</td><td>-</td><td>Mar<br>16</td><td>Mar<br>17</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>12</td><td>Apr<br>15</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>HOEGH</td><td>HOEGH YOKOHAMA</td><td>134</td><td>Mar<br>19</td><td>-</td><td>-</td><td>-</td><td>Mar<br>15</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Mar<br>19</td><td>-</td><td>-</td><td>-</td><td>Apr<br>20</td><td>Apr<br>13</td><td>Apr<br>12</td><td>Apr<br>18</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>NYK</td><td>ARIES LEADER</td><td>088</td><td>Mar<br>24</td><td>-</td><td>Mar<br>26</td><td>Mar<br>27</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>16</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>SEVEN SEALS CO.,LTD</td><td>JASA MURNI</td><td>69</td><td>Mar<br>26</td><td>-</td><td>Mar<br>27</td><td>Mar<br>30</td><td>Mar<br>29</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>May<br>1</td><td>May<br>3</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>SEVEN SEALS CO.,LTD(INTEROCEAN)</td><td>JASA MURNI</td><td>69</td><td>Mar<br>26</td><td>-</td><td>Mar<br>27</td><td>Mar<br>30</td><td>Mar<br>29</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>May<br>1</td><td>May<br>3</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>THE KEIHIN CO., LTD.</td><td>MORNING CAROL</td><td>153</td><td>Apr<br>1</td><td>-</td><td>Apr<br>2</td><td>Apr<br>3</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>May<br>7</td><td>Apr<br>29</td><td>May<br>1</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>NYK</td><td>VIKING PASSERO</td><td>049</td><td>Apr<br>2</td><td>-</td><td>Apr<br>3</td><td>Apr<br>4</td><td>Apr<br>5</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>30</td><td>May<br>7</td><td>May<br>9</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>MOL(SUN PHOENIX）</td><td>GENUINE ACE</td><td>0096A</td><td>Apr<br>3</td><td>-</td><td>Mar<br>27</td><td>Apr<br>1</td><td>-</td><td>-</td><td>-</td><td>Apr<br>4</td><td>Mar<br>31</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>23</td><td>Apr<br>30</td><td>May<br>1</td><td>Apr<br>24</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>MOL</td><td>GENUINE ACE</td><td>0096A</td><td>Apr<br>3</td><td>-</td><td>Mar<br>27</td><td>Apr<br>1</td><td>-</td><td>-</td><td>-</td><td>Apr<br>4</td><td>Mar<br>31</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>Apr<br>30</td><td>May<br>1</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>MOL</td><td>NEPTUNE ACE</td><td>0115A</td><td>Apr<br>9</td><td>-</td><td>Apr<br>8</td><td>Apr<br>12</td><td>-</td><td>-</td><td>-</td><td>Apr<br>10</td><td>Apr<br>13</td><td>-</td><td>-</td><td>-</td><td>Apr<br>28</td><td>May<br>4</td><td>May<br>11</td><td>May<br>12</td><td>May<br>5</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>MOL(SUN PHOENIX）</td><td>NEPTUNE ACE</td><td>0115A</td><td>Apr<br>9</td><td>-</td><td>Apr<br>8</td><td>Apr<br>12</td><td>-</td><td>-</td><td>-</td><td>Apr<br>10</td><td>Apr<br>13</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>O</td><td>O</td><td>O</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>MOL(INTEROCEAN）</td><td>NEPTUNE ACE</td><td>0115A</td><td>Apr<br>9</td><td>-</td><td>Apr<br>8</td><td>Apr<br>12</td><td>-</td><td>-</td><td>-</td><td>Apr<br>10</td><td>O</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>O</td><td>O</td><td>O</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>THE KEIHIN CO., LTD.</td><td>VIKING PASSAMA</td><td>004</td><td>Apr<br>10</td><td>-</td><td>Apr<br>11</td><td>Apr<br>12</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>May<br>7</td><td>May<br>9</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>NYK</td><td>ORION LEADER</td><td>054</td><td>Apr<br>12</td><td>-</td><td>Apr<br>15</td><td>Apr<br>17</td><td>Apr<br>16</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>May<br>15</td><td>May<br>8</td><td>May<br>6</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>SEVEN SEALS CO.,LTD</td><td>SLS-SLS</td><td>Apr</td><td>Apr<br>30</td><td>-</td><td>May<br>1</td><td>May<br>3</td><td>May<br>2</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>O</td><td>O</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#f3f3f3" nowrap=""><td>SEVEN SEALS CO.,LTD(INTEROCEAN)</td><td>INT-SLS</td><td></td><td>Apr<br>30</td><td>-</td><td>May<br>1</td><td>May<br>3</td><td>May<br>2</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>O</td><td>O</td><td>-</td><td>-</td></tr>
<tr class="row" bgcolor="#ffffff" nowrap=""><td>HOEGH</td><td>HOEGH Apr</td><td></td><td>O</td><td>-</td><td>-</td><td>-</td><td>O</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>-</td><td>O</td><td>O</td><td>O</td><td>-</td></tr>
		</tbody></table></div></div>`;

  useEffect(() => {
    const parseShippingData = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlTable, 'text/html');
      const rows = doc.querySelectorAll('tr.row');

      const parsedData = Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        return {
          company: cells[0].textContent,
          shipName: cells[1].textContent,
          voyage: cells[2].textContent,
          stops: Array.from(cells).slice(3).reduce((acc, cell, index) => {
            const column = columns[index + 3]; // Be sure columns array is adjusted accordingly
            const value = cell.textContent.trim();
            if (value !== '-') acc[column] = value;
            return acc;
          }, {})
        };
      });
      

      setShippingData(parsedData);
    };

    parseShippingData();
  }, []);

  return (
    <div className="shipping-table-container">
    <table className="shipping-table roro">
      <thead className="sticky-header">
        <tr>
          {columns.map((column, index) => (
            <th 
              key={index} 
              dangerouslySetInnerHTML={{
                __html: column.replace('-', '<br>')
              }} 
            />
          ))}
        </tr>
      </thead>
      <tbody className="scrollable-body">
        {shippingData.map((entry, index) => (
          <tr 
            key={index} 
            className="data-row"
            style={{
              backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9'
            }}
          >
            <td>{entry.company}</td>
            <td>{entry.shipName}</td>
            <td>{entry.voyage}</td>
            {columns.slice(3).map((column, colIndex) => (
              <td key={colIndex}>
                {entry.stops[column] || '-'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default AfricaRoroShippingTable;