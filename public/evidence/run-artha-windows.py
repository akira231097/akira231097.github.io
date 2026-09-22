"""Exercise unchanged Artha tests with collection before Windows cleanup.

SQLite context managers commit but do not close their handles. CPython may
leave these cyclic handles pending GC, and Windows cannot unlink an open DB.
Collect just before each test's existing tearDown; change no test assertions
or application behavior.
"""
import gc
import pathlib
import sys
import unittest

repo = pathlib.Path.cwd()
sys.path.insert(0, str(repo))
from tests.test_mcp_execution import TestExecutionCoordinator, TestOrderContract

original_teardown = TestExecutionCoordinator.tearDown
def collected_teardown(self):
    gc.collect()
    original_teardown(self)
TestExecutionCoordinator.tearDown = collected_teardown
suite = unittest.TestSuite([
    unittest.defaultTestLoader.loadTestsFromTestCase(TestExecutionCoordinator),
    unittest.defaultTestLoader.loadTestsFromTestCase(TestOrderContract),
])
result = unittest.TextTestRunner(verbosity=2).run(suite)
raise SystemExit(0 if result.wasSuccessful() else 1)
