(function() {
  Snap.plugin(function(Snap, Element, Paper, glob) {
    return Paper.prototype.multitext = function(x, y, txt, maxWidth, maxHeight, attributes) {
      var abc, bbox, currentLine, i, l, letterWidth, lines, svg, t, temp, tspans, widthSoFar, words;
      svg = Snap();
      abc = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      temp = svg.text(0, 0, abc);
      temp.attr(attributes);
      letterWidth = temp.getBBox().width / abc.length;
      svg.remove();
      words = txt.split(' ');
      widthSoFar = 0;
      currentLine = 0;
      lines = [''];
      i = 0;
      while (i < words.length) {
        l = words[i].length;
        if (widthSoFar + l * letterWidth > maxWidth) {
          lines.push('');
          currentLine++;
          widthSoFar = 0;
        }
        widthSoFar += l * letterWidth;
        lines[currentLine] += words[i] + ' ';
        i++;
      }
      t = this.text(x, y, lines).attr(attributes);
      y = y + t.getBBox().height;
      tspans = t.selectAll('tspan:nth-child(n+2)');
      tspans.attr({
        x: x,
        dy: '1.3em'
      });
      bbox = t.getBBox();
      if (bbox.width < maxWidth) {
        x = x + (maxWidth - bbox.width) / 2;
      }
      if (bbox.height < maxHeight) {
        y = y + (maxHeight - bbox.height) / 2;
      }
      t.attr({
        x: x,
        y: y
      });
      tspans.attr({
        x: x
      });
      return t;
    };
  });

  this.SnappyDiagram = (function() {
    function SnappyDiagram(options1) {
      var defaults, key, value;
      this.options = options1 != null ? options1 : {};
      this.cellCount = 0;
      this.rowCount = 0;
      this.cells = [];
      this.connectors = [];
      defaults = {
        width: 1000,
        height: 500,
        cellSpacing: 10,
        boxRadius: 5,
        markerWidth: 7,
        markerHeight: 10
      };
      for (key in defaults) {
        value = defaults[key];
        if (this.options[key] == null) {
          this.options[key] = value;
        }
      }
      this.snap = Snap(this.options.width, this.options.height).attr({
        "class": 'snappy-diagram'
      });
      this.markerEnd = this.triangleMarker(this.options.markerWidth, this.options.markerHeight);
      this.markerStart = this.triangleMarker(this.options.markerWidth, this.options.markerHeight, true);
    }

    SnappyDiagram.prototype.triangleMarker = function(width, height, reverse) {
      var connectorPathString, path;
      if (reverse == null) {
        reverse = false;
      }
      connectorPathString = "M 0 0 L " + height + " " + (width / 2) + " L 0 " + width + " z";
      path = this.snap.path(connectorPathString);
      if (reverse) {
        path = path.transform('r180');
      }
      path = path.marker(0, 0, height, width, (reverse ? 1 : height), width / 2);
      return path;
    };

    SnappyDiagram.prototype.addCell = function(cellX, cellY, options) {
      var cell;
      if (options == null) {
        options = {};
      }
      this.cellCount = Math.max(cellX + 1, this.cellCount);
      this.rowCount = Math.max(cellY + 1, this.rowCount);
      if (this.cells[cellX] == null) {
        this.cells[cellX] = [];
      }
      cell = new SnappyCell(this, cellX, cellY, options);
      this.cells[cellX].push(cell);
      return cell;
    };

    SnappyDiagram.prototype.addConnector = function(cellStart, cellEnd, options) {
      var connector;
      if (options == null) {
        options = {};
      }
      connector = new SnappyConnector(this, cellStart, cellEnd, options);
      this.connectors.push(connector);
      return connector;
    };

    SnappyDiagram.prototype.setDimensions = function() {
      this.cellWidth = this.options.width / this.cellCount;
      return this.cellHeight = this.options.height / this.rowCount;
    };

    SnappyDiagram.prototype.draw = function() {
      this.setDimensions();
      this.drawCells();
      return this.drawConnectors();
    };

    SnappyDiagram.prototype.drawCells = function() {
      var cell, j, len, ref, results, row;
      this.setDimensions();
      ref = this.cells;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        if (row != null) {
          results.push((function() {
            var k, len1, results1;
            results1 = [];
            for (k = 0, len1 = row.length; k < len1; k++) {
              cell = row[k];
              results1.push(cell.draw());
            }
            return results1;
          })());
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    SnappyDiagram.prototype.drawConnectors = function() {
      var connector, j, len, ref, results;
      this.setDimensions();
      ref = this.connectors;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        connector = ref[j];
        results.push(connector.draw());
      }
      return results;
    };

    return SnappyDiagram;

  })();

  this.SnappyCell = (function() {
    function SnappyCell(diagram, cellX1, cellY1, options1) {
      var base, base1;
      this.diagram = diagram;
      this.cellX = cellX1;
      this.cellY = cellY1;
      this.options = options1 != null ? options1 : {};
      (base = this.options).shape || (base.shape = 'box');
      (base1 = this.options).attrs || (base1.attrs = {});
      this;
    }

    SnappyCell.prototype.x = function() {
      return this.cellX * this.diagram.cellWidth;
    };

    SnappyCell.prototype.y = function() {
      return this.cellY * this.diagram.cellHeight;
    };

    SnappyCell.prototype.anchorCoords = function(anchor) {
      var xOffset, yOffset;
      xOffset = this[this.options.shape + "XOffset"] != null ? this[this.options.shape + "XOffset"](anchor) : this.diagram.options.cellSpacing / 2;
      yOffset = this[this.options.shape + "YOffset"] != null ? this[this.options.shape + "YOffset"](anchor) : this.diagram.options.cellSpacing / 2;
      switch (anchor) {
        case 'top-left':
          return {
            x: this.x() + xOffset,
            y: this.y() + yOffset
          };
        case 'top-middle':
          return {
            x: this.x() + this.diagram.cellWidth / 2,
            y: this.y() + yOffset
          };
        case 'top-right':
          return {
            x: this.x() + this.diagram.cellWidth - xOffset,
            y: this.y() + yOffset
          };
        case 'middle-left':
          return {
            x: this.x() + xOffset,
            y: this.y() + this.diagram.cellHeight / 2
          };
        case 'middle-right':
          return {
            x: this.x() + this.diagram.cellWidth - xOffset,
            y: this.y() + this.diagram.cellHeight / 2
          };
        case 'bottom-left':
          return {
            x: this.x() + xOffset,
            y: this.y() + this.diagram.cellHeight - yOffset
          };
        case 'bottom-middle':
          return {
            x: this.x() + this.diagram.cellWidth / 2,
            y: this.y() + this.diagram.cellHeight - yOffset
          };
        case 'bottom-right':
          return {
            x: this.x() + this.diagram.cellWidth - xOffset,
            y: this.y() + this.diagram.cellHeight - yOffset
          };
      }
    };

    SnappyCell.prototype.spacingOffset = function() {
      return this.diagram.options.cellSpacing / 2;
    };

    SnappyCell.prototype.circleRadius = function() {
      return (Math.min(this.diagram.cellWidth, this.diagram.cellHeight) - this.diagram.options.cellSpacing) / 2;
    };

    SnappyCell.prototype.boxXOffset = function(anchor) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.diagram.options.boxRadius / 3 + this.spacingOffset();
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCell.prototype.boxYOffset = function(anchor) {
      return this.boxXOffset(anchor);
    };

    SnappyCell.prototype.parallelogramXOffset = function(anchor) {
      if (['top-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.parallelogramOffset() + this.spacingOffset();
      } else if (['middle-left', 'middle-right'].indexOf(anchor) >= 0) {
        return this.parallelogramOffset() / 2 + this.spacingOffset();
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCell.prototype.ellipseXOffset = function(anchor) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.spacingOffset() + this.diagram.cellWidth * 0.1313;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCell.prototype.ellipseYOffset = function(anchor) {
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        return this.spacingOffset() + this.diagram.cellHeight * 0.1313;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCell.prototype.circleXOffset = function(anchor) {
      var offset;
      offset = this.spacingOffset();
      if (this.diagram.cellWidth > this.diagram.cellHeight && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0) {
        offset += (this.diagram.cellWidth - this.diagram.cellHeight) / 2;
      }
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        offset += this.circleRadius() * 0.2626;
      }
      if (offset != null) {
        return offset;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCell.prototype.circleYOffset = function(anchor) {
      var offset;
      offset = this.spacingOffset();
      if (this.diagram.cellHeight > this.diagram.cellWidth && ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right'].indexOf(anchor) >= 0) {
        offset += (this.diagram.cellHeight - this.diagram.cellWidth) / 2;
      }
      if (['top-left', 'top-right', 'bottom-left', 'bottom-right'].indexOf(anchor) >= 0) {
        offset += this.circleRadius() * 0.2626;
      }
      if (offset != null) {
        return offset;
      } else {
        return this.spacingOffset();
      }
    };

    SnappyCell.prototype.cellAttrs = function(className) {
      var attrs;
      attrs = this.options.attrs;
      attrs["class"] = [this.options.attrs["class"], 'snappy-cell', className].join(' ');
      return attrs;
    };

    SnappyCell.prototype.centerPoint = function() {
      return {
        x: this.x() + this.diagram.cellWidth / 2,
        y: this.y() + this.diagram.cellHeight / 2
      };
    };

    SnappyCell.prototype.boxPoints = function() {
      var x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y() + this.diagram.options.cellSpacing / 2;
      return {
        x1: x,
        y1: y,
        x2: x + this.diagram.cellWidth - this.diagram.options.cellSpacing,
        y2: y + this.diagram.cellHeight - this.diagram.options.cellSpacing
      };
    };

    SnappyCell.prototype.draw = function() {
      switch (this.options.shape) {
        case 'circle':
          this.drawCircle();
          break;
        case 'ellipse':
          this.drawEllipse();
          break;
        case 'parallelogram':
          this.drawParallelogram();
          break;
        default:
          this.drawBox();
      }
      if (this.options.text) {
        return this.element = this.diagram.snap.g(this.element, this.drawText());
      }
    };

    SnappyCell.prototype.drawBox = function() {
      var points;
      points = this.boxPoints();
      return this.element = this.diagram.snap.rect(points.x1, points.y1, points.x2 - points.x1, points.y2 - points.y1, this.diagram.options.boxRadius).attr(this.cellAttrs('snappy-cell-box'));
    };

    SnappyCell.prototype.drawCircle = function() {
      var centerPoint;
      centerPoint = this.centerPoint();
      return this.element = this.diagram.snap.circle(centerPoint.x, centerPoint.y, this.circleRadius()).attr(this.cellAttrs('snappy-cell-box'));
    };

    SnappyCell.prototype.drawEllipse = function() {
      var centerPoint, xRadius, yRadius;
      centerPoint = this.centerPoint();
      xRadius = (this.diagram.cellWidth - this.diagram.options.cellSpacing) / 2;
      yRadius = (this.diagram.cellHeight - this.diagram.options.cellSpacing) / 2;
      return this.element = this.diagram.snap.ellipse(centerPoint.x, centerPoint.y, xRadius, yRadius).attr(this.cellAttrs('snappy-cell-ellipse'));
    };

    SnappyCell.prototype.parallelogramOffset = function() {
      var offset;
      return offset = this.diagram.cellWidth / 10;
    };

    SnappyCell.prototype.drawParallelogram = function() {
      var offset, points, polygon;
      offset = this.parallelogramOffset();
      points = this.boxPoints();
      polygon = [points.x1 + offset, points.y1, points.x2, points.y1, points.x2 - offset, points.y2, points.x1, points.y2, points.x1 + offset, points.y1];
      return this.element = this.diagram.snap.polyline(polygon).attr(this.cellAttrs('snappy-cell-parallelogram'));
    };

    SnappyCell.prototype.drawText = function() {
      var maxHeight, maxWidth, textElement, x, y;
      x = this.x() + this.diagram.options.cellSpacing / 2;
      y = this.y();
      maxWidth = this.diagram.cellWidth - this.diagram.options.cellSpacing;
      maxHeight = this.diagram.cellHeight - this.diagram.options.cellSpacing;
      return textElement = this.diagram.snap.multitext(x, y, this.options.text, maxWidth, maxHeight);
    };

    return SnappyCell;

  })();

  this.SnappyConnector = (function() {
    function SnappyConnector(diagram, cellStart1, cellEnd1, options1) {
      this.diagram = diagram;
      this.cellStart = cellStart1;
      this.cellEnd = cellEnd1;
      this.options = options1 != null ? options1 : {};
      this;
    }

    SnappyConnector.prototype.horizontalLabel = function(diff) {
      if (diff > 1) {
        return 'left';
      } else if (diff < -1) {
        return 'right';
      } else {
        return 'middle';
      }
    };

    SnappyConnector.prototype.verticalLabel = function(diff) {
      if (diff > 1) {
        return 'top';
      } else if (diff < -1) {
        return 'bottom';
      } else {
        return 'middle';
      }
    };

    SnappyConnector.prototype.draw = function() {
      var attrs, endAnchor, endLabel, line, startAnchor, startLabel;
      startLabel = this.options.startAnchor || [this.verticalLabel(this.cellStart.cellY - this.cellEnd.cellY), this.horizontalLabel(this.cellStart.cellX - this.cellEnd.cellX)].join('-');
      endLabel = this.options.endAnchor || [this.verticalLabel(this.cellEnd.cellY - this.cellStart.cellY), this.horizontalLabel(this.cellEnd.cellX - this.cellStart.cellX)].join('-');
      startAnchor = this.cellStart.anchorCoords(startLabel);
      endAnchor = this.cellEnd.anchorCoords(endLabel);
      attrs = {};
      if (this.options.style !== 'line') {
        attrs.markerEnd = this.diagram.markerEnd;
      }
      if (this.options.style === 'double') {
        attrs.markerStart = this.diagram.markerStart;
      }
      attrs["class"] = 'snappy-connector';
      return line = this.diagram.snap.line(startAnchor.x, startAnchor.y, endAnchor.x, endAnchor.y).attr(attrs);
    };

    return SnappyConnector;

  })();

}).call(this);
