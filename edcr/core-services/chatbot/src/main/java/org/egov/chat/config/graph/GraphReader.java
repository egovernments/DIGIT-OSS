package org.egov.chat.config.graph;

import lombok.extern.slf4j.Slf4j;
import org.jgrapht.Graph;
import org.jgrapht.graph.DefaultDirectedGraph;
import org.jgrapht.graph.DefaultEdge;
import org.jgrapht.io.CSVFormat;
import org.jgrapht.io.CSVImporter;
import org.jgrapht.io.ImportException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.apache.commons.io.IOUtils;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

@Component
@Slf4j
public class GraphReader {

    private Graph<String, DefaultEdge> graph;

    @Autowired
    public GraphReader() throws ImportException {
        InputStream inputStream = null;
        CSVImporter<String, DefaultEdge> csvImporter = new CSVImporter<>((s, map) -> s,
                (s, v1, s2, map) -> new DefaultEdge(), CSVFormat.ADJACENCY_LIST, ',');

        graph = new DefaultDirectedGraph<>(DefaultEdge.class);
        try {
            inputStream = GraphReader.class.getResourceAsStream("GRAPH_ADJACENCY_LIST.csv");
            csvImporter.importGraph(graph, inputStream);
        }
        catch (Exception e) {
            log.error("Exception while fetching file" , e);
        } finally {
            IOUtils.closeQuietly(inputStream);
        }
    }

    public List<String> getNextNodes(String node) {
        List<String> nextNodes = new ArrayList<>();

        Set<DefaultEdge> edges = graph.outgoingEdgesOf(node);
        Iterator<DefaultEdge> edgeIterator = edges.iterator();

        while (edgeIterator.hasNext()) {
            DefaultEdge edge = edgeIterator.next();
            String targetVertext = graph.getEdgeTarget(edge);
            nextNodes.add(targetVertext);
        }

        return nextNodes;
    }

    public Set<String> getAllVertices() {
        return graph.vertexSet();
    }

}
